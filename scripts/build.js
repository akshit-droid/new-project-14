const fs = require("fs");
const path = require("path");
const { getCollections } = require("../content/collections");
const {
  renderCollectionIndexPage,
  renderCollectionEntryPage,
  renderNotFoundPage,
  renderSitemapXml,
  renderRobotsTxt
} = require("../lib/content-pages");

const rootDir = path.resolve(__dirname, "..");
const publicDir = path.join(rootDir, "public");
const srcDir = path.join(rootDir, "src");
const distDir = path.join(rootDir, "dist");

const resetDir = (dir) => {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  fs.mkdirSync(dir, { recursive: true });
};

const copyDir = (from, to) => {
  fs.cpSync(from, to, { recursive: true });
};

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

const buildBaseUrl =
  normalizeSiteUrl(process.env.SITE_URL, "https") ||
  normalizeSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL, "https") ||
  normalizeSiteUrl(process.env.VERCEL_URL, "https") ||
  "http://localhost:3001";

const writeTextFile = (relativePath, content) => {
  const outputPath = path.join(distDir, relativePath);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, content);
};

const writeCollectionPages = (collectionKey) => {
  const collections = getCollections();
  const collection = collections[collectionKey];
  if (!collection) {
    return;
  }

  const indexHtml = renderCollectionIndexPage(collectionKey, buildBaseUrl);
  if (indexHtml) {
    writeTextFile(path.join(collectionKey, "index.html"), indexHtml);
  }

  collection.items.forEach((entry) => {
    const entryHtml = renderCollectionEntryPage(collectionKey, entry.slug, buildBaseUrl);
    if (!entryHtml) {
      return;
    }
    writeTextFile(path.join(collectionKey, entry.slug, "index.html"), entryHtml);
  });
};

resetDir(distDir);
copyDir(publicDir, distDir);
copyDir(srcDir, path.join(distDir, "src"));
writeCollectionPages("blog");
writeCollectionPages("knowledge");
writeTextFile("sitemap.xml", renderSitemapXml(buildBaseUrl));
writeTextFile("robots.txt", renderRobotsTxt(buildBaseUrl));
writeTextFile("404.html", renderNotFoundPage(buildBaseUrl));

console.log(`Build complete: dist/ (${buildBaseUrl})`);
