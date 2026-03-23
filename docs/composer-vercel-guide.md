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
2. **Login**: Use `composer@gmail.com` / `123123`. The page features custom branding and no longer prefills credentials.
3. **Manage Live Content**: View the "Live Content" list. This is real-time in production via GitHub.
4. **Edit/Delete**: 
   - Click **Edit** to load a post into the editor.
   - Click **Delete** to instantly remove a post from GitHub.
5. **Create Page**: 
   - Fill collection, slug, title, etc.
   - Author content using the Quill rich text editor.
   - Click **Save Content**.

What happens:

- **Create/Save**: API commits `content/<collection>/<slug>.json` to GitHub.
- **Delete**: API deletes the file from GitHub.
- **Live Sync**: The composer list updates immediately from GitHub.
- **Deployment**: Vercel auto-deploys the changes (takes 1-2 mins).

## 5) Verify

After deployment completes, check:

- `/<collection>/<slug>` (for new pages)
- `/blog` or `/knowledge` listing
- `/sitemap.xml`
- `/robots.txt`

## Notes

- In local development, default backend is `filesystem`.
- On Vercel, recommended backend is `github`.
- The "Live Content" list is powered by the GitHub API in production, ensuring real-time visibility for the content team.
