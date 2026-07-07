# Today's Vibe

A daily vibe check — one click, get your fortune.

**todaysvibe.lol** (coming soon)

## What is this?

A lightweight, shareable daily fortune site. Each day you get a unique vibe: a name (like "Cosmic Hurricane"), a description, an emoji, a lucky number, a lucky color, and a 6-dimension personality breakdown.

All generated deterministically from the date — everyone gets the same vibe on the same day. No login. No server. Pure static magic.

## How it works

- **Date-seeded PRNG**: [mulberry32](https://gist.github.com/tommyettinger/46a874533244883189143505d203312c) algorithm seeded by today's date
- **Combinatorial pools**: ~300 adj × 200 nouns × 175 desc × 100 colors × 150 emoji × 99 numbers ≈ billions of unique vibes
- **localStorage**: saves today's result + 14-day history
- **Zero dependencies**: HTML + CSS + vanilla JS, no frameworks, no build step

## File structure

```
index.html    — entry point, static HTML
style.css     — all styles, mobile-first responsive
app.js        — core logic: PRNG, vibe gen, rendering, share, particles
data.js       — data pools: adjectives, nouns, descriptions, colors, emojis
```

## Run locally

```bash
python3 -m http.server 8765
# open http://localhost:8765
```

Or use any static file server.

## Deploy

Push to GitHub and connect to [Cloudflare Pages](https://pages.cloudflare.com/) or [Vercel](https://vercel.com/). No environment variables, no build command. Just point at the repo root.

## Share feature

Generates a 1080×1350 PNG share card (Canvas-rendered) with:
- Fortune-slip card layout
- Vibe name, emoji, description
- 6-dimension stat bars
- Lucky number

Uses Web Share API on mobile, falls back to download on desktop.

## License

MIT
