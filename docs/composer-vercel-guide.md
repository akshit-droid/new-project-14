# Composer on Vercel (Step-by-Step)

This guide explains how to deploy and run the `/composer` page for content teams on Vercel.

## 1) Deploy current code

From project root:

```bash
vercel deploy -y
```

This gives you a preview URL. Composer UI will be available at:

```text
https://<preview-domain>/composer
```

## 2) Enable Composer API on Vercel

The UI can open without API, but creating pages requires API + backend configuration.

This repo uses [`vercel.json`](../vercel.json) to route all requests to `server.js`, including `/api/content`.

Set these Vercel environment variables:

1. `ENABLE_CONTENT_COMPOSER_API=true`
2. `CONTENT_COMPOSER_BACKEND=github`
3. `GITHUB_REPO=<owner>/<repo>`
4. `GITHUB_BRANCH=main` (or your deploy branch)
5. `GITHUB_TOKEN=<github token with repo content write access>`

You can set them in Vercel Project Settings > Environment Variables.

## 3) Redeploy after env setup

```bash
vercel deploy -y
```

## 4) Content team workflow

1. Open `/composer`.
2. Fill collection (`blog` or `knowledge`), slug, title, description, tags.
3. Add HTML body (`<h2>`, `<p>`, `<img src="...">`, etc.).
4. Click **Create Page**.

What happens:

- API commits `content/<collection>/<slug>.json` into your GitHub repo.
- Vercel auto-deploys the new commit.
- Page becomes live at `/<collection>/<slug>`.

## 5) Verify

After deployment completes, check:

- `/<collection>/<slug>`
- `/blog` or `/knowledge` listing
- `/sitemap.xml`
- `/robots.txt`

## Notes

- In local development, default backend is `filesystem`.
- On Vercel, recommended backend is `github`.
- If API is disabled, `/composer` still loads but save action returns a clear error.
