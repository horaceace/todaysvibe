# Today's Vibe

> A daily vibe check — one click, get your fortune.

**Live**: [todaysvibe.today](https://todaysvibe.today) · [pages.dev](https://todaysvibe.pages.dev)
**Repo**: [github.com/horaceace/todaysvibe](https://github.com/horaceace/todaysvibe)

---

## What is this?

A lightweight, shareable daily fortune site. Each day, everyone gets the same unique vibe:

- **Name** — curated full title (e.g. "Main Character Energy"), date-seeded from a phrase pool
- **Description** — a short mood/fate line (e.g. "You're literally the main character today")
- **Emoji** — randomly paired (150 emoji pool)
- **Lucky color** + **Lucky number** (1–99)
- **6-dimension stat bars** — Energy, Chaos, Creative, Social, Focus, Mystic (each scored 1–10)

All generated deterministically from the date. No login. No server. No database.

---

## How it works

### PRNG (pseudorandom number generator)

Uses the [mulberry32](https://gist.github.com/tommyettinger/46a874533244883189143505d203312c) algorithm seeded with today's date string (`YYYY-MM-DD`). Same date = same seed = same vibe for everyone.

### Combinatorial data pool

| Pool | Count | Example |
|---|---|---|
| Adjectives | ~300 | Cosmic, Stormy, Golden, Chaotic, Euphoric... |
| Nouns | ~200 | Hurricane, Thunder, Starlight, Phoenix... |
| Descriptions | ~175 | "You're literally the main character today"... |
| Colors | 100 | Tailwind-inspired hex palette |
| Emojis | 150 | 🔮 🌊 ⚡ 🎭 🌙 🔥 |
| Numbers | 99 | 1–99 |
| **Total combinations** | **~15.6 trillion** | |

### Persistence

- `localStorage` saves today's result (no re-roll on refresh)
- 14-day history stored locally
- Clearable by user at any time

### Tech stack

- **Zero dependencies** — HTML + CSS + vanilla JS
- **No build step** — serve the directory directly
- **Mobile-first** responsive, works as PWA-capable (manifest optional)
- **Canvas** used only for share card generation (1080×1350 PNG)

---

## File structure

```
todaysvibe/
├── index.html      # Static entry point, semantic HTML
├── style.css       # All styles, CSS custom properties for theming
├── app.js          # Core logic
│   ├── PRNG (mulberry32)
│   ├── Vibe generator
│   ├── Bars renderer (HTML/CSS)
│   ├── Share card generator (Canvas → PNG)
│   ├── Particle system
│   └── localStorage persistence
├── data.js         # Data pools (18KB)
├── README.md
├── ROADMAP.md
└── preview.png     # Project preview
```

---

## Run locally

```bash
# Python
python3 -m http.server 8765

# Node
npx serve .

# Any static file server works
```

Open `http://localhost:8765`.

---

## Deploy

### Cloudflare Pages (recommended)

1. Push to GitHub
2. Cloudflare Dashboard → Workers & Pages → Pages → Connect to Git
3. Select `horaceace/todaysvibe`
4. Build settings: **No framework**, output directory: `/` (root)
5. Deploy

### Manual deploy via wrangler

```bash
npx wrangler login
npx wrangler pages deploy . --project-name=todaysvibe
```

### Vercel / Netlify

Same approach — point at repo root, no build command needed.

---

## Design system

**Daily Poster** — UI is the product. The page is a vertical poster, not an app panel.

| Element | Approach |
|---|---|
| Canvas | Warm paper field (`#f4f1ea` → `#ebe6db`), max width 400px |
| Cover | Big type question + solid ink `Reveal` pill + date line |
| Poster | Bare emoji, oversized name, editorial 6-stat rows, lucky stamp |
| Accent | Day-seeded lucky color: wash, name mark, stat fills, share image |
| Motion | Print-in only (fade + rise). No particles, no orb chrome |
| Share image | 1080×1350 PNG matching on-page poster composition |

---

## API / Data format

The vibe object stored in localStorage:

```json
{
  "name": "Cosmic Hurricane",
  "desc": "You're literally the main character today.",
  "emoji": "🌊",
  "color": "#8b5cf6",
  "number": 53,
  "scores": [7, 9, 6, 8, 5, 4],
  "bg": {
    "name": "lavender",
    "css": "linear-gradient(...)"
  },
  "date": "2026-07-07"
}
```

---

## License

MIT
