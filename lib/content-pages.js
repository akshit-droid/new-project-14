const { getCollections, siteMetadata } = require("../content/collections");

const toSafeUrl = (url) => String(url || "").replace(/\/+$/, "");

const escapeHtml = (value) =>
  String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const escapeXml = (value) =>
  String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const joinUrl = (baseUrl, pathname) => `${toSafeUrl(baseUrl)}${pathname}`;

const stripHtml = (value) =>
  String(value || "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const sanitizeHtml = (value) =>
  String(value || "")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+=(['"]).*?\1/gi, "")
    .replace(/\son\w+=([^\s>]+)/gi, "")
    .replace(/\s(href|src)=(['"])\s*javascript:[\s\S]*?\2/gi, " $1=\"#\"");

const formatDate = (dateValue) =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date(dateValue));

const formatMachineDate = (dateValue) => new Date(dateValue).toISOString();

const getSortedEntries = (collectionKey, collections) => {
  const collection = collections[collectionKey];
  if (!collection) {
    return [];
  }
  return [...collection.items]
    .filter((item) => !item.isDraft)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
};

const getEntryWordCount = (entry) => {
  const sectionText = (entry.sections || []).flatMap((section) => {
    if (section.type === "list") {
      return section.items || [];
    }
    if (section.type === "html") {
      return stripHtml(section.html || "");
    }
    return section.text || "";
  });
  return sectionText
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
};

const getReadingMinutes = (entry) => entry.readingMinutes || Math.max(1, Math.round(getEntryWordCount(entry) / 220));

const renderTopNav = (activeKey) => `
  <nav class="content-top-nav container">
    <a href="/" class="content-brand">${escapeHtml(siteMetadata.siteName)}</a>
    <div class="content-links">
      <a href="/blog" class="${activeKey === "blog" ? "active" : ""}">Blog</a>
      <a href="/knowledge" class="${activeKey === "knowledge" ? "active" : ""}">Knowledge Base</a>
      <a href="/#contact">Book Demo</a>
    </div>
  </nav>
`;

const renderHead = ({
  title,
  description,
  canonical,
  image,
  type = "website",
  jsonLd = [],
  extraMeta = ""
}) => `
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta name="robots" content="index,follow,max-image-preview:large" />
  <link rel="canonical" href="${escapeHtml(canonical)}" />
  <meta property="og:type" content="${escapeHtml(type)}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${escapeHtml(canonical)}" />
  <meta property="og:image" content="${escapeHtml(image)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${escapeHtml(image)}" />
  ${extraMeta}
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Source+Sans+3:wght@400;500;600;700&display=swap"
    rel="stylesheet"
  />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="stylesheet" href="/styles.css" />
  <link rel="stylesheet" href="/content.css" />
  ${jsonLd
    .map(
      (schemaObject) =>
        `<script type="application/ld+json">${JSON.stringify(schemaObject)}</script>`
    )
    .join("\n")}
`;

const renderLayout = ({ head, body, activeKey }) => `<!DOCTYPE html>
<html lang="en">
  <head>
    ${head}
    <!-- Google tag (gtag.js) --> <script async src="https://www.googletagmanager.com/gtag/js?id=G-ZJXF46NEW0"></script> <script>   window.dataLayer = window.dataLayer || [];   function gtag(){dataLayer.push(arguments);}   gtag('js', new Date());    gtag('config', 'G-ZJXF46NEW0'); </script>
  </head>
  <body class="content-body">
    <div class="content-page">
      ${renderTopNav(activeKey)}
      ${body}
    </div>
    <div id="cta-modal-overlay" style="display: none; position: fixed; inset: 0; background: rgba(15, 30, 55, 0.6); backdrop-filter: blur(8px); z-index: 9999; align-items: center; justify-content: center; padding: 20px;">
      <div id="cta-modal-card" style="background: white; padding: 32px; border-radius: 20px; box-shadow: 0 20px 50px rgba(15,30,55,0.15); width: 100%; max-width: 400px; position: relative;">
        <button id="cta-modal-close" style="position: absolute; top: 16px; right: 16px; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #586175;">&times;</button>
        <h3 style="margin-top:0; font-family: 'Manrope', sans-serif;">Request a Demo</h3>
        <p style="color: #636578; font-size: 0.95rem; margin-bottom: 20px;">Share your requirements and we will reach out shortly.</p>
        <form id="cta-modal-form" style="display: grid; gap: 12px; text-align: left;">
          <input type="text" name="name" placeholder="Your full name" required style="width: 100%; border: 1px solid #d8e2ee; border-radius: 8px; padding: 10px; font-family: inherit;">
          <input type="email" name="email" placeholder="you@company.com" required style="width: 100%; border: 1px solid #d8e2ee; border-radius: 8px; padding: 10px; font-family: inherit;">
          <input type="tel" name="phone" placeholder="Phone number" required style="width: 100%; border: 1px solid #d8e2ee; border-radius: 8px; padding: 10px; font-family: inherit;">
          <button type="submit" id="cta-modal-submit" style="background: linear-gradient(135deg, #2063ce, #25ceae); color: white; border: none; padding: 12px; border-radius: 999px; font-weight: 700; cursor: pointer; margin-top: 8px;">Submit Request</button>
        </form>
        <div id="cta-modal-status" style="margin-top: 16px; font-size: 0.9rem; font-weight: 600; text-align: center; display: none;"></div>
      </div>
    </div>
    <script>
      const ctaModal = document.getElementById("cta-modal-overlay");
      const ctaClose = document.getElementById("cta-modal-close");
      const ctaForm = document.getElementById("cta-modal-form");
      const ctaStatus = document.getElementById("cta-modal-status");
      const ctaSubmit = document.getElementById("cta-modal-submit");

      document.querySelectorAll(".sidebar-cta-btn, .content-links a[href='/#contact']").forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          ctaModal.style.display = "flex";
          ctaStatus.style.display = "none";
        });
      });

      ctaModal.addEventListener("click", (e) => {
        if (e.target === ctaModal) ctaModal.style.display = "none";
      });
      ctaClose.addEventListener("click", () => ctaModal.style.display = "none");

      ctaForm.addEventListener("submit", (e) => {
        e.preventDefault();
        ctaSubmit.textContent = "Submitting...";
        ctaSubmit.disabled = true;

        const data = new FormData(ctaForm);
        fetch("https://formsubmit.co/ajax/aadhar@electrovese.com", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            name: data.get("name"),
            email: data.get("email"),
            phone: data.get("phone"),
            _subject: "Ezupp ERP Demo Request (Blog)",
            _cc: "pranav@electrovese.com,akshit@electrovese.com",
            _replyto: data.get("email"),
            _captcha: "false"
          })
        })
        .then(res => res.json())
        .then(() => {
          ctaStatus.textContent = "Thanks! Your request has been submitted.";
          ctaStatus.style.color = "#067647";
          ctaStatus.style.display = "block";
          ctaForm.reset();
        })
        .catch(() => {
          ctaStatus.textContent = "Submission failed. Please try again.";
          ctaStatus.style.color = "#b42318";
          ctaStatus.style.display = "block";
        })
        .finally(() => {
          ctaSubmit.textContent = "Submit Request";
          ctaSubmit.disabled = false;
        });
      });
    </script>
  </body>
</html>`;

const renderSection = (section) => {
  if (section.type === "html") {
    return `<div class="article-html">${sanitizeHtml(section.html)}</div>`;
  }

  if (section.type === "heading") {
    return `<h2>${escapeHtml(section.text)}</h2>`;
  }

  if (section.type === "subheading") {
    return `<h3>${escapeHtml(section.text)}</h3>`;
  }

  if (section.type === "list") {
    const items = (section.items || [])
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join("");
    return `<ul>${items}</ul>`;
  }

  if (section.type === "quote") {
    return `<blockquote>${escapeHtml(section.text)}</blockquote>`;
  }

  return `<p>${escapeHtml(section.text)}</p>`;
};

const renderCollectionIndexPage = (collectionKey, baseUrl) => {
  const collections = getCollections();
  const collection = collections[collectionKey];
  if (!collection) {
    return null;
  }

  const entries = getSortedEntries(collectionKey, collections);
  const canonical = joinUrl(baseUrl, collection.basePath);
  const pageTitle = `${collection.headline} | ${siteMetadata.siteName}`;
  const pageDescription = collection.description;
  const image = joinUrl(baseUrl, siteMetadata.defaultImage);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: pageTitle,
    description: pageDescription,
    url: canonical,
    hasPart: entries.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.title,
      url: joinUrl(baseUrl, `${collection.basePath}/${entry.slug}`)
    }))
  };

  const cards = entries
    .map((entry) => {
      const entryPath = `${collection.basePath}/${entry.slug}`;
      return `
        <article class="content-card">
          <div class="content-card-meta">
            <time datetime="${escapeHtml(formatMachineDate(entry.publishedAt))}">${escapeHtml(
        formatDate(entry.publishedAt)
      )}</time>
            <span>${getReadingMinutes(entry)} min read</span>
          </div>
          <h2><a href="${entryPath}">${escapeHtml(entry.title)}</a></h2>
          <p>${escapeHtml(entry.excerpt || entry.description)}</p>
          <div class="content-tags">
            ${(entry.tags || [])
              .map((tag) => `<span class="content-tag">${escapeHtml(tag)}</span>`)
              .join("")}
          </div>
          <a class="content-read-more" href="${entryPath}">Read article</a>
        </article>
      `;
    })
    .join("");

  const head = renderHead({
    title: pageTitle,
    description: pageDescription,
    canonical,
    image,
    jsonLd: [itemListSchema]
  });

  const body = `
    <main class="container content-main">
      <header class="content-hero">
        <p class="content-eyebrow">${escapeHtml(collection.label)}</p>
        <h1>${escapeHtml(collection.headline)}</h1>
        <p>${escapeHtml(collection.description)}</p>
      </header>
      <section class="content-grid">
        ${cards}
      </section>
    </main>
  `;

  return renderLayout({ head, body, activeKey: collectionKey });
};

const renderCollectionEntryPage = (collectionKey, slug, baseUrl) => {
  const collections = getCollections();
  const collection = collections[collectionKey];
  if (!collection) {
    return null;
  }

  const entries = getSortedEntries(collectionKey, collections);
  const entry = collection.items.find((item) => item.slug === slug);
  if (!entry) {
    return null;
  }

  const canonical = joinUrl(baseUrl, `${collection.basePath}/${entry.slug}`);
  const pageTitle = `${entry.title} | ${siteMetadata.siteName}`;
  const pageDescription = entry.description;
  const image = joinUrl(baseUrl, siteMetadata.defaultImage);
  const wordCount = getEntryWordCount(entry);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": collection.schemaType,
    headline: entry.title,
    description: entry.description,
    datePublished: formatMachineDate(entry.publishedAt),
    dateModified: formatMachineDate(entry.updatedAt || entry.publishedAt),
    articleSection: collection.label,
    keywords: (entry.tags || []).join(", "),
    wordCount,
    mainEntityOfPage: canonical,
    author: {
      "@type": "Organization",
      name: entry.author || siteMetadata.companyName
    },
    publisher: {
      "@type": "Organization",
      name: siteMetadata.companyName
    },
    image
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: joinUrl(baseUrl, "/")
      },
      {
        "@type": "ListItem",
        position: 2,
        name: collection.label,
        item: joinUrl(baseUrl, collection.basePath)
      },
      {
        "@type": "ListItem",
        position: 3,
        name: entry.title,
        item: canonical
      }
    ]
  };

  const extraMeta = `
    <meta property="article:published_time" content="${escapeHtml(
      formatMachineDate(entry.publishedAt)
    )}" />
    <meta property="article:modified_time" content="${escapeHtml(
      formatMachineDate(entry.updatedAt || entry.publishedAt)
    )}" />
    <meta property="article:section" content="${escapeHtml(collection.label)}" />
    ${(entry.tags || [])
      .map((tag) => `<meta property="article:tag" content="${escapeHtml(tag)}" />`)
      .join("")}
  `;

  const head = renderHead({
    title: pageTitle,
    description: pageDescription,
    canonical,
    image,
    type: "article",
    jsonLd: [articleSchema, breadcrumbSchema],
    extraMeta
  });

  const related = entries
    .filter((item) => item.slug !== entry.slug)
    .slice(0, 2)
    .map(
      (item) => `
        <a class="related-link" href="${collection.basePath}/${item.slug}">
          <span>${escapeHtml(formatDate(item.publishedAt))}</span>
          <strong>${escapeHtml(item.title)}</strong>
        </a>
      `
    )
    .join("");

  const body = `
    <main class="container article-main">
      <p class="article-back"><a href="${collection.basePath}">&#8592; Back to ${escapeHtml(collection.label)}</a></p>

      <div class="article-layout">

        <!-- CENTER ARTICLE -->
        <article class="article-shell">
          <header class="article-header">
            <p class="content-eyebrow">${escapeHtml(collection.label)}</p>
            <h1>${escapeHtml(entry.title)}</h1>
            <p class="article-description">${escapeHtml(entry.description)}</p>
            <div class="article-meta">
              <span>By ${escapeHtml(entry.author || siteMetadata.companyName)}</span>
              <time datetime="${escapeHtml(formatMachineDate(entry.publishedAt))}">${escapeHtml(formatDate(entry.publishedAt))}</time>
              <span>${getReadingMinutes(entry)} min read</span>
            </div>
            <div class="content-tags">
              ${(entry.tags || []).map((tag) => `<span class="content-tag">${escapeHtml(tag)}</span>`).join("")}
            </div>
          </header>
          <div class="article-body">
            ${(entry.sections || []).map(renderSection).join("\n")}
          </div>
        </article>

      </div>
    </main>
  `;

  return renderLayout({ head, body, activeKey: collectionKey });
};

const renderNotFoundPage = (baseUrl) => {
  const canonical = joinUrl(baseUrl, "/");
  const head = renderHead({
    title: `Page not found | ${siteMetadata.siteName}`,
    description: "The requested page could not be found.",
    canonical,
    image: joinUrl(baseUrl, siteMetadata.defaultImage)
  });

  const body = `
    <main class="container content-main not-found">
      <h1>Page not found</h1>
      <p>Try browsing the sections below.</p>
      <div class="not-found-links">
        <a href="/">Home</a>
        <a href="/blog">Blog</a>
        <a href="/knowledge">Knowledge Base</a>
      </div>
    </main>
  `;

  return renderLayout({ head, body });
};

const renderSitemapXml = (baseUrl) => {
  const collections = getCollections();
  const pages = [
    { path: "/", lastmod: new Date().toISOString().slice(0, 10) },
    { path: "/blog", lastmod: getSortedEntries("blog", collections)[0]?.updatedAt || null },
    { path: "/knowledge", lastmod: getSortedEntries("knowledge", collections)[0]?.updatedAt || null }
  ];

  Object.values(collections).forEach((collection) => {
    collection.items.forEach((entry) => {
      pages.push({
        path: `${collection.basePath}/${entry.slug}`,
        lastmod: entry.updatedAt || entry.publishedAt
      });
    });
  });

  const urlEntries = pages
    .map(
      (page) => `
  <url>
    <loc>${escapeXml(joinUrl(baseUrl, page.path))}</loc>
    ${page.lastmod ? `<lastmod>${escapeXml(page.lastmod)}</lastmod>` : ""}
  </url>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlEntries}
</urlset>`;
};

const renderRobotsTxt = (baseUrl) => `User-agent: *
Allow: /

Sitemap: ${joinUrl(baseUrl, "/sitemap.xml")}
`;

module.exports = {
  renderCollectionIndexPage,
  renderCollectionEntryPage,
  renderNotFoundPage,
  renderSitemapXml,
  renderRobotsTxt
};
