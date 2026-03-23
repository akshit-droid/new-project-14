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
  return [...collection.items].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
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
  </head>
  <body class="content-body">
    <div class="content-page">
      ${renderTopNav(activeKey)}
      ${body}
    </div>
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
  const entry = entries.find((item) => item.slug === slug);
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

  const rightTagsHtml = (entry.tags || []).length
    ? `<div class="sidebar-card">
        <h3 class="sidebar-card-title">Tags</h3>
        <div class="content-tags sidebar-tags">
          ${(entry.tags || []).map((tag) => `<span class="content-tag">${escapeHtml(tag)}</span>`).join("")}
        </div>
      </div>`
    : "";

  const rightRelatedHtml = related
    ? `<div class="sidebar-card">
        <h3 class="sidebar-card-title">Related reads</h3>
        ${related}
      </div>`
    : "";

  const body = `
    <main class="container article-main">
      <p class="article-back"><a href="${collection.basePath}">&#8592; Back to ${escapeHtml(collection.label)}</a></p>

      <div class="article-layout">

        <!-- LEFT SIDEBAR -->
        <aside class="article-sidebar article-sidebar--left">
          <div class="sidebar-card sidebar-about">
            <div class="sidebar-about-logo">${escapeHtml(siteMetadata.siteName)}</div>
            <p class="sidebar-about-text">Ezupp ERP helps FMCG &amp; distribution teams manage sales fleets, distributor networks, and supply chains from a single platform.</p>
            <a href="/#contact" class="sidebar-cta-btn">Book a Demo</a>
          </div>
          <div class="sidebar-card sidebar-stat-card">
            <div class="sidebar-stat">28%</div>
            <p class="sidebar-stat-label">Faster order cycles for customers on Ezupp</p>
          </div>
          <div class="sidebar-card sidebar-stat-card">
            <div class="sidebar-stat">3×</div>
            <p class="sidebar-stat-label">Faster distributor onboarding</p>
          </div>
        </aside>

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

        <!-- RIGHT SIDEBAR -->
        <aside class="article-sidebar article-sidebar--right">
          ${rightTagsHtml}
          ${rightRelatedHtml}
          <div class="sidebar-card sidebar-cta-card">
            <h3 class="sidebar-card-title">See Ezupp in action</h3>
            <p class="sidebar-cta-text">Get a personalised walkthrough of the Ezupp platform for your team.</p>
            <a href="/#contact" class="sidebar-cta-btn sidebar-cta-btn--full">Request a Demo</a>
          </div>
        </aside>

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
