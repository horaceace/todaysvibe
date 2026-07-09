// ============================================================
// Today's Vibe — Color Drop
// Full-bleed daily color. UI is the product.
// ============================================================

const STORE_KEY = "todaysvibe_drop_v2";
const HIST_KEY = "todaysvibe_drop_hist_v2";

const $ = (s) => document.querySelector(s);

const DIMS = [
  { key: "energy", label: "Energy" },
  { key: "chaos", label: "Chaos" },
  { key: "creative", label: "Create" },
  { key: "social", label: "Social" },
  { key: "focus", label: "Focus" },
  { key: "mystic", label: "Mystic" }
];

const dom = {
  field: $("#field"),
  cover: $("#cover"),
  drop: $("#drop"),
  coverDate: $("#cover-date"),
  dropDate: $("#drop-date"),
  revealBtn: $("#reveal-btn"),
  emoji: $("#drop-emoji"),
  name: $("#drop-name"),
  desc: $("#drop-desc"),
  scoreboard: $("#scoreboard"),
  number: $("#drop-number"),
  hex: $("#drop-hex"),
  shareBtn: $("#share-btn"),
  history: $("#history"),
  themeMeta: $("#theme-meta")
};

let vibe = null;

/** Local calendar day (not UTC) so late-night Asia users match getDateSeed */
function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function readJSON(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch {
    return null;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn("[todaysvibe] localStorage write failed", err);
  }
}

function clearKey(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

function isValidVibe(v) {
  return (
    !!v &&
    typeof v.name === "string" &&
    typeof v.desc === "string" &&
    typeof v.color === "string" &&
    typeof v.emoji === "string" &&
    typeof v.number === "number" &&
    typeof v.date === "string" &&
    Array.isArray(v.scores) &&
    v.scores.length === DIMS.length
  );
}

function formatDate(d = new Date()) {
  return d
    .toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
    .toUpperCase();
}

function formatShort(iso) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  });
}

function parseHex(hex) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16)
  };
}

function luminance(hex) {
  const { r, g, b } = parseHex(hex);
  const lin = [r, g, b].map((c) => {
    const x = c / 255;
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

function isLightColor(hex) {
  return luminance(hex) > 0.55;
}

/** Deepen pale/pastel luckies so full-bleed never reads as beige paper */
function fieldColor(hex) {
  const { r, g, b } = parseHex(hex);
  const L = luminance(hex);
  // Target a rich stage: mix toward black when too light, slight darken always
  let t = 0.22;
  if (L > 0.72) t = 0.55;
  else if (L > 0.55) t = 0.42;
  else if (L > 0.4) t = 0.28;
  const nr = Math.round(r * (1 - t));
  const ng = Math.round(g * (1 - t));
  const nb = Math.round(b * (1 - t));
  return `#${[nr, ng, nb].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}

function applyTheme(color) {
  const stage = fieldColor(color);
  document.documentElement.style.setProperty("--lucky", color);
  document.documentElement.style.setProperty("--stage", stage);
  // Stage is always darkened enough → light type on color (never beige + dark ink)
  document.body.classList.remove("is-light");
  document.body.style.background = stage;
  if (dom.themeMeta) dom.themeMeta.setAttribute("content", stage);
}

function nameClass(name) {
  if (!name || typeof name !== "string") return "";
  // Size by longest word + total length so we shrink before mid-word wrap
  const longest = Math.max(...name.split(/\s+/).map((w) => w.length), 0);
  if (name.length > 24 || longest > 12) return "is-xlong";
  if (name.length > 14 || longest > 9) return "is-long";
  return "";
}

function makeVibe() {
  const rng = seededRandom(getDateSeed());
  // Full curated title (intentional phrase) — not adjective+noun mash
  return {
    name: pickFrom(VIBE_TITLES, rng),
    desc: pickFrom(DESCRIPTIONS, rng),
    color: pickFrom(COLORS, rng),
    emoji: pickFrom(EMOJIS, rng),
    number: Math.floor(rng() * 99) + 1,
    scores: DIMS.map(() => Math.floor(rng() * 10) + 1),
    date: todayISO()
  };
}

function loadOrCreate() {
  const saved = readJSON(STORE_KEY);
  if (saved && saved.date === todayISO() && isValidVibe(saved)) return saved;
  // Corrupt / incomplete entry for today — drop it and mint a fresh vibe
  if (saved && saved.date === todayISO()) clearKey(STORE_KEY);

  const v = makeVibe();
  writeJSON(STORE_KEY, v);

  const rawHist = readJSON(HIST_KEY);
  const hist = Array.isArray(rawHist) ? rawHist : [];
  const next = hist.filter((h) => h && h.date !== v.date);
  next.push({ name: v.name, emoji: v.emoji, color: v.color, date: v.date });
  writeJSON(HIST_KEY, next.slice(-14));
  return v;
}

function renderScoreboard(scores, animate) {
  // Same vertical stack language as the cover — not a widget grid
  dom.scoreboard.innerHTML = DIMS.map(
    (d, i) => `
    <div class="stat-line" role="listitem" style="--i:${i}">
      <span class="stat-line__label">${d.label}</span>
      <span class="stat-line__track" aria-hidden="true"><span class="stat-line__fill" style="--w:${(scores[i] / 10) * 100}%"></span></span>
      <span class="stat-line__n">${scores[i]}</span>
    </div>`
  ).join("");

  const rows = dom.scoreboard.querySelectorAll(".stat-line");
  if (animate) {
    requestAnimationFrame(() => rows.forEach((r) => r.classList.add("is-on")));
  } else {
    rows.forEach((r) => {
      r.classList.add("is-on");
      r.style.animation = "none";
      r.style.opacity = "1";
      r.style.transform = "none";
      const fill = r.querySelector(".stat-line__fill");
      if (fill) fill.style.transition = "none";
    });
  }
}

function renderHistory() {
  if (!dom.history) return;
  const rawHist = readJSON(HIST_KEY);
  const hist = Array.isArray(rawHist) ? rawHist : [];
  const past = hist.filter((h) => h && h.date && h.date !== todayISO()).reverse();
  if (!past.length) {
    dom.history.hidden = true;
    return;
  }
  dom.history.hidden = false;
  dom.history.innerHTML = past
    .slice(0, 5)
    .map(
      (h) => `
    <li class="history-item">
      <span class="history-date">${formatShort(h.date)}</span>
      <span class="history-emoji">${h.emoji || ""}</span>
      <span class="history-name">${h.name || ""}</span>
    </li>`
    )
    .join("");
}

function renderDrop(v, animate) {
  applyTheme(v.color);

  const d = new Date(v.date + "T12:00:00");
  dom.dropDate.textContent = formatDate(d);
  dom.emoji.textContent = v.emoji;
  dom.name.textContent = v.name;
  dom.name.className = `drop-name ${nameClass(v.name)}`.trim();
  dom.desc.textContent = v.desc;
  dom.number.textContent = String(v.number).padStart(2, "0");
  dom.hex.textContent = v.color.toUpperCase();
  dom.hex.style.background = v.color;
  dom.hex.style.color = isLightColor(v.color) ? "#0a0a0a" : "#f2efe8";

  renderScoreboard(v.scores, animate);
  renderHistory();

  document.title = `${v.name} — Today's Vibe`;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute("content", `${v.emoji} ${v.name}. ${v.desc}`);
}

function showDrop(animate) {
  document.body.classList.add("is-dropped");
  dom.cover.classList.add("hidden");
  dom.drop.classList.remove("hidden");
  if (animate) {
    dom.drop.style.animation = "none";
    void dom.drop.offsetWidth;
    dom.drop.style.animation = "";
  }
}

function reveal(ev) {
  if (ev) {
    ev.preventDefault();
    ev.stopPropagation();
  }

  // Already have today's vibe but still on cover (stuck UI) → force show result
  if (vibe) {
    try {
      renderDrop(vibe, false);
      showDrop(false);
    } catch (err) {
      console.error("[todaysvibe] re-show failed", err);
      clearKey(STORE_KEY);
      vibe = null;
    }
    if (vibe) return;
  }

  try {
    vibe = loadOrCreate();
  } catch (err) {
    console.error("[todaysvibe] reveal failed", err);
    vibe = null;
    return;
  }

  if (dom.revealBtn) dom.revealBtn.classList.add("is-leaving");

  if (navigator.vibrate) {
    try {
      navigator.vibrate([10, 30, 14]);
    } catch (_) {}
  }

  setTimeout(() => {
    try {
      renderDrop(vibe, true);
      showDrop(true);
    } catch (err) {
      console.error("[todaysvibe] render failed", err);
      // Allow retry if paint blows up
      clearKey(STORE_KEY);
      vibe = null;
      if (dom.revealBtn) dom.revealBtn.classList.remove("is-leaving");
    }
  }, 320);
}

function share() {
  if (!vibe) return;
  const dataUrl = makeShareImage(vibe);

  if (navigator.share && navigator.canShare) {
    fetch(dataUrl)
      .then((r) => r.blob())
      .then((blob) => {
        const file = new File([blob], `todaysvibe-${vibe.date}.png`, { type: "image/png" });
        const payload = {
          title: "Today's Vibe",
          text: `${vibe.emoji} ${vibe.name} — ${vibe.color}`,
          files: [file]
        };
        if (navigator.canShare(payload)) return navigator.share(payload);
        download(dataUrl);
      })
      .catch(() => download(dataUrl));
  } else {
    download(dataUrl);
  }
}

function download(url) {
  const a = document.createElement("a");
  a.download = `todaysvibe-${vibe.date}.png`;
  a.href = url;
  a.click();
}

function makeShareImage(v) {
  const W = 1080;
  const H = 1350;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d");

  // Full-bleed stage (deepened — never pastel paper)
  const stage = fieldColor(v.color);
  ctx.fillStyle = stage;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "rgba(0,0,0,0.12)";
  ctx.fillRect(0, 0, W, H);

  const pad = 80;
  let y = 100;
  const ink = "#f2efe8";
  const softInk = "rgba(242,239,232,0.62)";
  const faintInk = "rgba(242,239,232,0.34)";

  ctx.fillStyle = faintInk;
  ctx.font = "700 26px Syne, system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(formatDate(new Date(v.date + "T12:00:00")), pad, y);
  ctx.textAlign = "right";
  ctx.fillText("TODAY'S VIBE", W - pad, y);

  y = 260;
  ctx.textAlign = "left";
  ctx.font = "130px sans-serif";
  ctx.fillText(v.emoji, pad, y);

  y = 400;
  let size = 96;
  if (v.name.length > 26) size = 58;
  else if (v.name.length > 16) size = 74;
  ctx.fillStyle = ink;
  ctx.font = `800 ${size}px Syne, system-ui, sans-serif`;
  y = wrapLeft(ctx, v.name, pad, y, W - pad * 2, size * 1.05, 3);

  y += 20;
  ctx.fillStyle = softInk;
  ctx.font = `italic 400 38px "Instrument Serif", Georgia, serif`;
  y = wrapLeft(ctx, v.desc, pad, y, W - pad * 2, 50, 3);

  y += 48;
  // vertical stats (match on-page)
  for (let i = 0; i < 6; i++) {
    const sy = y + i * 52;
    ctx.fillStyle = faintInk;
    ctx.font = "700 22px Syne, system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(DIMS[i].label.toUpperCase(), pad, sy);

    const trackX = pad + 200;
    const trackW = W - pad - trackX - 70;
    ctx.fillStyle = "rgba(242,239,232,0.14)";
    ctx.fillRect(trackX, sy - 12, trackW, 6);
    ctx.fillStyle = ink;
    ctx.fillRect(trackX, sy - 12, trackW * (v.scores[i] / 10), 6);

    ctx.textAlign = "right";
    ctx.font = "800 28px Syne, system-ui, sans-serif";
    ctx.fillText(String(v.scores[i]), W - pad, sy);
  }

  y += 6 * 52 + 48;
  ctx.textAlign = "left";
  ctx.fillStyle = faintInk;
  ctx.font = "700 22px Syne, system-ui, sans-serif";
  ctx.fillText("NO.", pad, y);
  ctx.fillStyle = ink;
  ctx.font = "800 80px Syne, system-ui, sans-serif";
  ctx.fillText(String(v.number).padStart(2, "0"), pad, y + 70);

  // original lucky hex chip
  ctx.fillStyle = v.color;
  roundRectFill(ctx, W - pad - 160, y + 20, 160, 48, 10);
  ctx.fillStyle = isLightColor(v.color) ? "#0a0a0a" : "#f2efe8";
  ctx.font = "700 22px ui-monospace, monospace";
  ctx.textAlign = "center";
  ctx.fillText(v.color.toUpperCase(), W - pad - 80, y + 52);

  ctx.fillStyle = faintInk;
  ctx.font = "600 24px Syne, system-ui, sans-serif";
  ctx.fillText("todaysvibe.today", W / 2, H - 64);

  return c.toDataURL("image/png");
}

function roundRectFill(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
  ctx.fill();
}

function wrapLeft(ctx, text, x, y, maxW, lh, maxLines) {
  const words = text.split(" ");
  let line = "";
  let lines = 0;
  let cy = y;
  ctx.textAlign = "left";

  for (let i = 0; i < words.length; i++) {
    const test = line + words[i] + " ";
    if (ctx.measureText(test).width > maxW && i > 0) {
      ctx.fillText(line.trim(), x, cy);
      line = words[i] + " ";
      cy += lh;
      lines++;
      if (lines >= maxLines - 1) {
        let rest = words.slice(i).join(" ");
        while (ctx.measureText(rest + "…").width > maxW && rest.length > 1) rest = rest.slice(0, -1);
        ctx.fillText(rest + (rest !== words.slice(i).join(" ") ? "…" : ""), x, cy);
        return cy + lh;
      }
    } else line = test;
  }
  ctx.fillText(line.trim(), x, cy);
  return cy + lh;
}

function bindClicks() {
  // Single delegated handler (avoids double-fire + survives DOM quirks)
  document.addEventListener("click", (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;
    if (t.closest("#reveal-btn")) {
      e.preventDefault();
      reveal(e);
    } else if (t.closest("#share-btn")) {
      e.preventDefault();
      share();
    }
  });
}

function init() {
  bindClicks();

  try {
    if (dom.coverDate) dom.coverDate.textContent = formatDate();

    const saved = readJSON(STORE_KEY);
    if (saved && saved.date === todayISO() && isValidVibe(saved)) {
      vibe = saved;
      renderDrop(vibe, false);
      showDrop(false);
    } else if (saved && saved.date === todayISO()) {
      // Incomplete schema from an older build — clear so Reveal works again
      clearKey(STORE_KEY);
      vibe = null;
    }
  } catch (err) {
    console.error("[todaysvibe] init restore failed", err);
    clearKey(STORE_KEY);
    vibe = null;
  }
}

// Defer scripts already wait for DOM; guard anyway
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
