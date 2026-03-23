# Ezupp ERP Landing Page & CMS

A high-performance landing page and Content Management System for Ezupp ERP, a distribution-led ERP for sales and supply chains.

## Project Structure

- `public/`: Static internal assets and the CMS frontend.
  - `composer/`: The Content Management System (CMS) login and editor.
- `content/`: JSON-based content entries for the blog and knowledge base.
- `server.js`: Node.js server for local development and API handling.
- `lib/`: Core logic for rendering content pages and handling routing.

## Content Management System (CMS)

The CMS is accessible at `/composer` and allows for real-time management of blog posts and knowledge articles.

### Features

- **Branded Login**: Secure access via `/composer` with unique branding ("Ezupp Blogs").
- **Rich Text Editing**: Powered by Quill for HTML-assistive content creation.
- **Live Sync**: In production, the CMS fetches and lists content directly from the GitHub API.
- **Real-Time Actions**: Create, edit, and delete content directly from the production environment.
- **GitHub Integration**: Deletions and saves are committed directly to the repository, triggering automatic Vercel redeployments.

### Credentials
- **Username**: `composer@gmail.com`
- **Password**: `123123`

## Technical Details

- **Backend**: Node.js (CommonJS).
- **Frontend**: Vanilla HTML/JS with Quill.js for editing.
- **Deployment**: Vercel (Production) / Local Node Server (Development).
- **Data Source**: GitHub API for production live-sync; local filesystem for development.

## Documentation
- [Composer Vercel Guide](docs/composer-vercel-guide.md)
