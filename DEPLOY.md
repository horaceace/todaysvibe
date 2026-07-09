# Today's Vibe — Deployment Guide

## Overview

- **Stack**: Static HTML + CSS + vanilla JS (zero dependencies, no build step)
- **Repo**: `github.com/horaceace/todaysvibe`
- **Live**: `todaysvibe.today` (Cloudflare Pages)

---

## Prerequisites

- GitHub repo with your code pushed
- A Cloudflare account (free tier is sufficient)
- (Optional) A custom domain purchased from any registrar (Namecheap, Porkbun, Namesilo, etc.)

---

## Deploy to Cloudflare Pages

### Option A: Automatic Git-based deploy (recommended)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Pages** → **Connect to Git**
2. Select `horaceace/todaysvibe` from the repository list
3. Configure build settings:
   - **Production branch**: `main`
   - **Build command**: _(leave empty)_
   - **Build output directory**: `/`
   - **Framework preset**: _None_
4. Click **Save and Deploy**

Every `git push` to main triggers an automatic deploy.

### Option B: Manual deploy via Wrangler CLI

```bash
# Install wrangler
npm install -g wrangler

# Login
npx wrangler login

# Deploy
npx wrangler pages deploy . --project-name=todaysvibe --branch=main
```

If the project doesn't exist yet:

```bash
npx wrangler pages project create todaysvibe --production-branch=main
```

Then re-run the deploy command.

---

## Custom Domain Setup

1. In Cloudflare Pages, go to your project → **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain (e.g., `todaysvibe.today` and optionally `www.todaysvibe.today`)
4. Cloudflare will provide DNS records. If your domain's DNS is already on Cloudflare, it's auto-configured.
5. If DNS is elsewhere:
   - Add a `CNAME` record for `@` or `www` pointing to `todaysvibe.pages.dev`
   - Or transfer DNS to Cloudflare for one-click setup
6. Wait for DNS propagation (usually 1–10 minutes)
7. SSL certificate is auto-provisioned by Cloudflare

---

## Local Development

```bash
# Python
python3 -m http.server 8765

# Node (requires `npx serve`)
npx serve .

# PHP
php -S localhost:8765

# Then open
open http://localhost:8765
```

The project has **zero dependencies** and **no build step** — serve the directory directly with any static file server.

---

## File Structure

```
todaysvibe/
├── index.html      # Static HTML, SEO meta tags, structured data
├── style.css       # Dark theme, crystal ball UI, animations
├── app.js          # Core logic: PRNG, vibe gen, starfield, share
├── data.js         # Combinatorial word pools (~18KB)
├── preview.png     # Social share preview image (1200×630)
├── robots.txt      # Allow all crawlers
├── README.md       # Project overview
├── ROADMAP.md      # Development roadmap
└── DEPLOY.md       # This file
```

---

## Analytics (Optional)

Cloudflare Web Analytics is free, privacy-friendly (no cookie banner needed), and one-click:

1. Cloudflare Dashboard → **Analytics & Logs** → **Web Analytics**
2. Add your site
3. Copy the JavaScript snippet into `index.html` `<head>`

---

## Environment Variables

None required. The site is fully static with zero server-side logic.

---

## Troubleshooting

| Issue | Fix |
|---|---|
| Deploy succeeds but site shows old version | Purge cache in Cloudflare → Caching → Purge Everything |
| Custom domain shows SSL error | Wait a few minutes for Cloudflare to provision the certificate |
| `wrangler deploy` fails with auth error | Run `npx wrangler login` again or export `CLOUDFLARE_API_TOKEN` |
| Local pages show stale data | Clear localStorage for `todaysvibe_hex_v3` key |
| Share image not showing | Check `preview.png` exists at repo root (1200×630) |
