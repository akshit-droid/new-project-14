const http = require("http");
const fs = require("fs");
const path = require("path");
const {
  renderCollectionIndexPage,
  renderCollectionEntryPage,
  renderNotFoundPage,
  renderSitemapXml,
  renderRobotsTxt
} = require("./lib/content-pages");
const { getCollections } = require("./content/collections");

const rootDir = __dirname;
const publicDir = path.join(rootDir, "public");
const contentDir = path.join(rootDir, "content");
const PORT = process.env.PORT || 3001;
const isVercel = Boolean(process.env.VERCEL);

const normalizeSiteUrl = (value, fallbackProtocol = "https") => {
  const raw = String(value || "").trim().replace(/\/+$/, "");
  if (!raw) {
    return null;
  }
  if (/^https?:\/\//i.test(raw)) {
    return raw;
  }
  return `${fallbackProtocol}://${raw}`;
};

const SITE_URL =
  normalizeSiteUrl(process.env.SITE_URL, "https") ||
  normalizeSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL, "https") ||
  normalizeSiteUrl(process.env.VERCEL_URL, "https") ||
  null;

// Composer API can run in two modes:
// - filesystem: writes JSON files directly (local development)
// - github: commits JSON files into a GitHub repo (recommended on Vercel)
const composerBackend = String(
  process.env.CONTENT_COMPOSER_BACKEND || (isVercel ? "github" : "filesystem")
)
  .trim()
  .toLowerCase();

const composerApiEnabled =
  process.env.ENABLE_CONTENT_COMPOSER_API === "true" ||
  (process.env.ENABLE_CONTENT_COMPOSER_API !== "false" &&
    process.env.NODE_ENV !== "production" &&
    !isVercel);

const githubRepo = String(process.env.GITHUB_REPO || "").trim();
const githubToken = String(process.env.GITHUB_TOKEN || "").trim();
const githubBranch = String(process.env.GITHUB_BRANCH || "main").trim();

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jsx": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp"
};

const sendContent = (res, statusCode, contentType, body) => {
  res.writeHead(statusCode, { "Content-Type": contentType });
  res.end(body);
};

const sendJson = (res, statusCode, payload) => {
  sendContent(res, statusCode, "application/json; charset=utf-8", JSON.stringify(payload));
};

const normalizeUrlPath = (rawPath) => {
  let pathValue = rawPath || "/";
  if (!pathValue.startsWith("/")) {
    pathValue = `/${pathValue}`;
  }
  pathValue = pathValue.replace(/\/{2,}/g, "/");
  if (pathValue.length > 1 && pathValue.endsWith("/")) {
    pathValue = pathValue.slice(0, -1);
  }
  return pathValue;
};

const getBaseUrl = (req) => {
  if (SITE_URL) {
    return SITE_URL;
  }

  const forwardedProto = String(req.headers["x-forwarded-proto"] || "")
    .split(",")[0]
    .trim();
  const forwardedHost = String(req.headers["x-forwarded-host"] || "")
    .split(",")[0]
    .trim();
  const protocol = forwardedProto || "http";
  const host = forwardedHost || String(req.headers.host || `localhost:${PORT}`).trim();
  return `${protocol}://${host}`;
};

const parseJsonBody = (req, maxBytes = 1024 * 1024) =>
  new Promise((resolve, reject) => {
    let body = "";
    let bytes = 0;

    req.on("data", (chunk) => {
      bytes += chunk.length;
      if (bytes > maxBytes) {
        reject(new Error("Payload too large"));
        req.destroy();
        return;
      }
      body += chunk.toString("utf8");
    });

    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (_err) {
        reject(new Error("Invalid JSON body"));
      }
    });

    req.on("error", (err) => reject(err));
  });

const toSlug = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const toDateString = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date.toISOString().slice(0, 10);
};

const normalizeEntryPayload = (payload) => {
  const collection = String(payload.collection || "").trim().toLowerCase();
  if (collection !== "blog" && collection !== "knowledge") {
    return { error: "collection must be 'blog' or 'knowledge'" };
  }

  const title = String(payload.title || "").trim();
  const description = String(payload.description || "").trim();
  const excerpt = String(payload.excerpt || description).trim();
  const html = String(payload.html || "").trim();
  const author = String(payload.author || "Ezupp Editorial Team").trim();
  const slug = toSlug(payload.slug || title);

  if (!slug) {
    return { error: "slug is required" };
  }
  if (!title) {
    return { error: "title is required" };
  }
  if (!description) {
    return { error: "description is required" };
  }
  if (!html) {
    return { error: "html content is required" };
  }

  const tags = Array.isArray(payload.tags)
    ? payload.tags.map((tag) => String(tag).trim()).filter(Boolean)
    : String(payload.tags || "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

  const publishedAt = toDateString(payload.publishedAt || new Date());
  const updatedAt = toDateString(payload.updatedAt || publishedAt);
  if (!publishedAt || !updatedAt) {
    return { error: "Invalid date format. Use YYYY-MM-DD." };
  }

  const entry = {
    slug,
    title,
    description,
    excerpt,
    publishedAt,
    updatedAt,
    author,
    tags,
    sections: [{ type: "html", html }]
  };

  return { collection, slug, entry };
};

const parseGithubRepo = (value) => {
  const parts = String(value || "")
    .trim()
    .split("/")
    .filter(Boolean);
  if (parts.length !== 2) {
    return null;
  }
  return { owner: parts[0], repo: parts[1] };
};

const encodeGithubPath = (filePath) =>
  filePath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

const createContentEntryFilesystem = ({ collection, slug, entry }) => {
  const targetDir = path.join(contentDir, collection);
  const targetFile = path.join(targetDir, `${slug}.json`);
  if (!targetFile.startsWith(`${targetDir}${path.sep}`)) {
    return { status: 400, error: "Invalid slug value" };
  }
  if (fs.existsSync(targetFile)) {
    return { status: 409, error: "Entry already exists. Use a different slug." };
  }

  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(targetFile, `${JSON.stringify(entry, null, 2)}\n`);

  return {
    status: 201,
    value: {
      message: "Entry created",
      collection,
      slug,
      filePath: path.relative(rootDir, targetFile),
      pagePath: `/${collection}/${slug}`,
      backend: "filesystem"
    }
  };
};

const createContentEntryGithub = async ({ collection, slug, entry }) => {
  const repoParts = parseGithubRepo(githubRepo);
  if (!repoParts) {
    return {
      status: 500,
      error: "Invalid GITHUB_REPO. Expected format: owner/repo"
    };
  }
  if (!githubToken) {
    return {
      status: 500,
      error: "Missing GITHUB_TOKEN for GitHub composer backend"
    };
  }

  const contentPath = `content/${collection}/${slug}.json`;
  const apiUrl = `https://api.github.com/repos/${repoParts.owner}/${repoParts.repo}/contents/${encodeGithubPath(
    contentPath
  )}`;
  const payload = {
    message: `content(${collection}): add ${slug}`,
    content: Buffer.from(`${JSON.stringify(entry, null, 2)}\n`).toString("base64"),
    branch: githubBranch
  };

  let response;
  try {
    response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${githubToken}`,
        "Content-Type": "application/json",
        "User-Agent": "ezupp-composer"
      },
      body: JSON.stringify(payload)
    });
  } catch (_error) {
    return {
      status: 502,
      error: "Failed to reach GitHub API"
    };
  }

  if (!response.ok) {
    let details = "";
    try {
      const result = await response.json();
      details = result.message || "";
    } catch (_err) {
      details = response.statusText || "";
    }

    if (response.status === 422) {
      return { status: 409, error: "Entry already exists in GitHub repository." };
    }

    return {
      status: response.status,
      error: `GitHub API error: ${details || "request failed"}`
    };
  }

  return {
    status: 201,
    value: {
      message: "Entry committed to GitHub",
      collection,
      slug,
      filePath: contentPath,
      pagePath: `/${collection}/${slug}`,
      backend: "github",
      note: "Vercel will publish this page after the new commit deploy completes."
    }
  };
};

const createContentEntry = async (payload) => {
  const normalized = normalizeEntryPayload(payload);
  if (normalized.error) {
    return { status: 400, error: normalized.error };
  }

  if (composerBackend === "github") {
    return createContentEntryGithub(normalized);
  }

  return createContentEntryFilesystem(normalized);
};

const resolveStaticCandidates = (normalizedPath) => {
  const withSrcPreference = normalizedPath.startsWith("src/");
  const baseDir = withSrcPreference ? rootDir : publicDir;
  const fallbackDir = withSrcPreference ? publicDir : path.join(rootDir, "src");
  const candidates = [path.join(baseDir, normalizedPath)];

  if (!path.extname(normalizedPath)) {
    candidates.push(path.join(baseDir, normalizedPath, "index.html"));
  }

  candidates.push(path.join(fallbackDir, normalizedPath));
  if (!path.extname(normalizedPath)) {
    candidates.push(path.join(fallbackDir, normalizedPath, "index.html"));
  }

  return candidates;
};

const server = http.createServer((req, res) => {
  const urlPath = req.url ? req.url.split("?")[0] : "/";
  const pathname = normalizeUrlPath(urlPath);
  const baseUrl = getBaseUrl(req);

  if (pathname === "/api/content") {
    if (composerBackend !== "filesystem" && composerBackend !== "github") {
      sendJson(res, 500, {
        error: "Invalid CONTENT_COMPOSER_BACKEND. Use 'filesystem' or 'github'."
      });
      return;
    }

    if (req.method === "GET") {
      const query = new URL(req.url, baseUrl).searchParams;
      const qCollection = query.get("collection");
      const qSlug = query.get("slug");

      const collections = getCollections();

      if (qCollection && qSlug) {
        const entry = collections[qCollection]?.items.find((i) => i.slug === qSlug);
        if (entry) {
          sendJson(res, 200, entry);
        } else {
          sendJson(res, 404, { error: "Entry not found" });
        }
        return;
      }

      const list = [];
      Object.keys(collections).forEach((key) => {
        collections[key].items.forEach((item) => {
          list.push({
            collection: key,
            slug: item.slug,
            title: item.title,
            publishedAt: item.publishedAt,
            author: item.author
          });
        });
      });
      sendJson(res, 200, list);
      return;
    }

    if (req.method === "DELETE") {
      const query = new URL(req.url, baseUrl).searchParams;
      const collection = query.get("collection");
      const slug = query.get("slug");

      if (!collection || !slug) {
        sendJson(res, 400, { error: "Missing collection or slug" });
        return;
      }

      if (composerBackend === "github") {
        const repoParts = parseGithubRepo(githubRepo);
        if (!repoParts || !githubToken) {
          sendJson(res, 500, { error: "GitHub API configuration missing" });
          return;
        }

        const contentPath = `content/${collection}/${slug}.json`;
        const apiUrl = `https://api.github.com/repos/${repoParts.owner}/${repoParts.repo}/contents/${encodeGithubPath(
          contentPath
        )}`;

        // Need the SHA to delete
        fetch(apiUrl, {
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${githubToken}`,
            "User-Agent": "ezupp-composer"
          }
        })
          .then(async (sr) => {
            if (!sr.ok) throw new Error("File not found on GitHub or API error");
            const fileData = await sr.json();
            return fetch(apiUrl, {
              method: "DELETE",
              headers: {
                Accept: "application/vnd.github+json",
                Authorization: `Bearer ${githubToken}`,
                "Content-Type": "application/json",
                "User-Agent": "ezupp-composer"
              },
              body: JSON.stringify({
                message: `content(${collection}): delete ${slug}`,
                sha: fileData.sha,
                branch: githubBranch
              })
            });
          })
          .then(async (dr) => {
            if (!dr.ok) throw new Error("Failed to delete from GitHub");
            sendJson(res, 200, { message: "Deleted from GitHub" });
          })
          .catch((err) => {
            sendJson(res, 500, { error: err.message });
          });
        return;
      }

      // Filesystem backend
      const targetPath = path.join(contentDir, collection, `${slug}.json`);
      if (fs.existsSync(targetPath)) {
        fs.unlinkSync(targetPath);
        sendJson(res, 200, { message: "Deleted from filesystem" });
      } else {
        sendJson(res, 404, { error: "File not found locally" });
      }
      return;
    }

    if (req.method !== "POST") {
      sendJson(res, 405, { error: "Method not allowed" });
      return;
    }

    parseJsonBody(req)
      .then(async (payload) => {
        const result = await createContentEntry(payload);
        if (result.error) {
          sendJson(res, result.status || 400, { error: result.error });
          return;
        }
        sendJson(res, result.status || 201, result.value);
      })
      .catch((err) => {
        const status = String(err.message || "").includes("Payload too large") ? 413 : 400;
        sendJson(res, status, { error: err.message || "Bad request" });
      });
    return;
  }

  if (pathname === "/sitemap.xml") {
    sendContent(res, 200, "application/xml; charset=utf-8", renderSitemapXml(baseUrl));
    return;
  }

  if (pathname === "/robots.txt") {
    sendContent(res, 200, "text/plain; charset=utf-8", renderRobotsTxt(baseUrl));
    return;
  }

  const collectionMatch = pathname.match(/^\/(blog|knowledge)$/);
  if (collectionMatch) {
    const collectionKey = collectionMatch[1];
    const html = renderCollectionIndexPage(collectionKey, baseUrl);
    if (!html) {
      sendContent(res, 404, "text/html; charset=utf-8", renderNotFoundPage(baseUrl));
      return;
    }
    sendContent(res, 200, "text/html; charset=utf-8", html);
    return;
  }

  const entryMatch = pathname.match(/^\/(blog|knowledge)\/([a-z0-9-]+)$/);
  if (entryMatch) {
    const collectionKey = entryMatch[1];
    const slug = entryMatch[2];
    const html = renderCollectionEntryPage(collectionKey, slug, baseUrl);
    if (!html) {
      sendContent(res, 404, "text/html; charset=utf-8", renderNotFoundPage(baseUrl));
      return;
    }
    sendContent(res, 200, "text/html; charset=utf-8", html);
    return;
  }

  // FALLBACK: Try root-level slugs for any collection
  const rootSlugMatch = pathname.match(/^\/([a-z0-9-]+)$/);
  if (rootSlugMatch) {
    const slug = rootSlugMatch[1];
    // Check blog then knowledge
    let html = renderCollectionEntryPage("blog", slug, baseUrl);
    if (!html) {
      html = renderCollectionEntryPage("knowledge", slug, baseUrl);
    }

    if (html) {
      sendContent(res, 200, "text/html; charset=utf-8", html);
      return;
    }
  }

  const safePath = pathname === "/" ? "/index.html" : pathname;
  const normalizedPath = path
    .normalize(safePath)
    .replace(/^(\.\.(\/|\\|$))+/, "")
    .replace(/^\//, "");

  const trySend = (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
    const stream = fs.createReadStream(filePath);
    stream.on("error", () => {
      sendContent(res, 500, "text/plain; charset=utf-8", "Internal Server Error");
    });
    stream.pipe(res);
  };

  const candidates = resolveStaticCandidates(normalizedPath);
  let index = 0;

  const tryNext = () => {
    if (index >= candidates.length) {
      if (path.extname(normalizedPath)) {
        sendContent(res, 404, "text/plain; charset=utf-8", "Not found");
        return;
      }
      sendContent(res, 404, "text/html; charset=utf-8", renderNotFoundPage(baseUrl));
      return;
    }

    const candidate = candidates[index];
    index += 1;
    fs.stat(candidate, (err, stat) => {
      if (!err && stat.isFile()) {
        trySend(candidate);
        return;
      }
      tryNext();
    });
  };

  tryNext();
});

server.listen(PORT, () => {
  console.log(`Ezupp ERP landing page running at http://localhost:${PORT}`);
});
