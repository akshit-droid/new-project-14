# Blog and Knowledge Authoring

This project serves SEO-friendly pages from JSON entries in:

- `content/blog/*.json`
- `content/knowledge/*.json`

## URL structure

- Blog index: `/blog`
- Blog article: `/blog/:slug`
- Knowledge index: `/knowledge`
- Knowledge article: `/knowledge/:slug`

## Create a new page quickly

Use the scaffold command:

```bash
npm run new:content -- --type blog --slug route-planning-basics --title "Route Planning Basics"
```

Supported `--type` values:

- `blog`
- `knowledge`

Useful optional flags:

- `--description "SEO description"`
- `--excerpt "Card summary"`
- `--author "Team Name"`
- `--tags "Field Sales,Execution,ERP"`
- `--publishedAt 2026-03-22`
- `--updatedAt 2026-03-22`
- `--dry-run`

The command creates:

- `content/blog/<slug>.json` for blog
- `content/knowledge/<slug>.json` for knowledge

## Composer UI (for content team)

Run local server:

```bash
npm run dev
```

Open:

```text
http://localhost:3001/composer
```

Fill collection, title, slug, description, and HTML body, then click **Create Page**.
This creates a JSON file in `content/blog` or `content/knowledge`.

Note: Composer write API is enabled for local development. In production/preview deployments it is disabled by default.
For Vercel setup (API + GitHub backend), follow:

- `docs/composer-vercel-guide.md`

## JSON entry fields

- `slug`: URL-safe id, lowercase with hyphens
- `title`: page heading and SEO title base
- `description`: SEO description and article summary
- `excerpt`: summary text shown on listing cards
- `publishedAt`: `YYYY-MM-DD`
- `updatedAt`: `YYYY-MM-DD`
- `author`: author or team name
- `tags`: array of keywords
- `sections`: ordered content blocks

Supported `sections` block types:

- `{ "type": "paragraph", "text": "..." }`
- `{ "type": "heading", "text": "..." }`
- `{ "type": "subheading", "text": "..." }`
- `{ "type": "list", "items": ["...", "..."] }`
- `{ "type": "quote", "text": "..." }`
- `{ "type": "html", "html": "<h2>...</h2><p>...</p><img src='...'>" }`

## SEO output generated automatically

- Canonical links
- Open Graph + Twitter meta
- JSON-LD structured data (`BlogPosting`/`TechArticle`)
- Dynamic `sitemap.xml`
- `robots.txt` with sitemap reference

## Production canonical URL behavior

Canonical and sitemap host selection priority:

1. `SITE_URL` (recommended)
2. `VERCEL_PROJECT_PRODUCTION_URL`
3. `VERCEL_URL`
4. Incoming request host headers

Example:

```bash
SITE_URL=https://www.ezupp.com npm run dev
```
