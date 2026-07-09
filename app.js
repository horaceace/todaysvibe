// ============================================================
// Today's Vibe — Daily Poster
// UI is the product.
// ============================================================

const STORE_KEY = "todaysvibe_poster_v1";
const HIST_KEY = "todaysvibe_poster_hist_v1";

const $ = (s) => document.querySelector(s);

const DIMS = [
  { key: "energy", label: "Energy" },
  { key: "chaos", label: "Chaos" },
  { key: "creative", label: "Creative" },
  { key: "social", label: "Social" },
  { key: "focus", label: "Focus" },
  { key: "mystic", label: "Mystic" }
];

const dom = {
  wash: $("#wash"),
  cover: $("#cover"),
  poster: $("#poster"),
  coverDate: $("#cover-date"),
  posterDate: $("#poster-date"),
  revealBtn: $("#reveal-btn"),
  emoji: $("#poster-emoji"),
  name: $("#poster-name"),
  desc: $("#poster-desc"),
  stats: $("#stats"),
  luckySwatch: $("#lucky-swatch"),
  luckyNumber: $("#lucky-number"),
  shareBtn: $("#share-btn"),
  history: $("#history"),
  historyList: $("#history-list")
};

let vibe = null;

// ---- Date helpers ----
function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function formatDateLine(d = new Date()) {
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const mm = months[d.getMonth()];
  const dd = String(d.getDate()).padStart(2, "0");
  return `${mm} · ${dd}`;
}

function formatShort(iso) {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ---- Theme ----
function applyLucky(color) {
  document.documentElement.style.setProperty("--lucky", color);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#f4f1ea");
}

// ---- Generate ----
function makeVibe() {
  const rng = seededRandom(getDateSeed());
  const scores = DIMS.map(() => Math.floor(rng() * 10) + 1);

  return {
    name: `${pickFrom(ADJECTIVES, rng)} ${pickFrom(NOUNS, rng)}`,
    desc: pickFrom(DESCRIPTIONS, rng),
    color: pickFrom(COLORS, rng),
    emoji: pickFrom(EMOJIS, rng),
    number: Math.floor(rng() * 99) + 1,
    scores,
    date: todayISO()
  };
}

function loadOrCreate() {
  const saved = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
  const today = todayISO();
  if (saved && saved.date === today) return saved;

  const v = makeVibe();
  localStorage.setItem(STORE_KEY, JSON.stringify(v));

  const hist = JSON.parse(localStorage.getItem(HIST_KEY) || "[]");
  const next = hist.filter((h) => h.date !== v.date);
  next.push({ name: v.name, emoji: v.emoji, color: v.color, date: v.date });
  localStorage.setItem(HIST_KEY, JSON.stringify(next.slice(-14)));
  return v;
}

// ---- Name sizing ----
function nameSizeClass(name) {
  if (name.length > 28) return "is-xlong";
  if (name.length > 18) return "is-long";
  return "";
}

// ---- Render ----
function renderStats(scores, animate) {
  dom.stats.innerHTML = DIMS.map(
    (d, i) => `
    <div class="stat-row" role="listitem" style="--i:${i};--w:${(scores[i] / 10) * 100}%">
      <span class="stat-label">${d.label}</span>
      <span class="stat-score">${scores[i]}</span>
      <div class="stat-track"><div class="stat-fill"></div></div>
    </div>`
  ).join("");

  const rows = dom.stats.querySelectorAll(".stat-row");
  if (animate) {
    requestAnimationFrame(() => {
      rows.forEach((row) => row.classList.add("is-on"));
    });
  } else {
    rows.forEach((row) => {
      row.classList.add("is-on");
      row.style.animation = "none";
      row.style.opacity = "1";
      row.style.transform = "none";
      const fill = row.querySelector(".stat-fill");
      if (fill) fill.style.transition = "none";
    });
  }
}

function renderPoster(v, animate) {
  applyLucky(v.color);

  dom.posterDate.textContent = `${formatDateLine(new Date(v.date + "T12:00:00"))} · TODAY`;
  dom.emoji.textContent = v.emoji;
  dom.name.textContent = v.name;
  dom.name.className = `poster-name ${nameSizeClass(v.name)}`.trim();
  dom.desc.textContent = v.desc;
  dom.luckySwatch.style.background = v.color;
  dom.luckyNumber.textContent = String(v.number).padStart(2, "0");

  renderStats(v.scores, animate);
  renderHistory();

  document.title = `${v.name} — Today's Vibe`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", v.desc);
}

function renderHistory() {
  const hist = JSON.parse(localStorage.getItem(HIST_KEY) || "[]");
  const past = hist.filter((h) => h.date !== todayISO()).reverse();
  if (!past.length) {
    dom.history.hidden = true;
    return;
  }
  dom.history.hidden = false;
  dom.historyList.innerHTML = past
    .map(
      (h) => `
    <li class="history-item">
      <span class="history-date">${formatShort(h.date)}</span>
      <span class="history-emoji">${h.emoji}</span>
      <span class="history-name">${h.name}</span>
    </li>`
    )
    .join("");
}

function showPoster(animate) {
  document.body.classList.add("is-revealed");
  dom.cover.classList.add("hidden");
  dom.poster.classList.remove("hidden");
  if (animate) {
    dom.poster.classList.remove("is-entering");
    // restart animation
    void dom.poster.offsetWidth;
    dom.poster.classList.add("is-entering");
  } else {
    dom.poster.classList.remove("is-entering");
  }
}

// ---- Reveal ----
function reveal() {
  if (vibe) return;

  vibe = loadOrCreate();
  dom.revealBtn.classList.add("is-leaving");

  if (navigator.vibrate) {
    try {
      navigator.vibrate(12);
    } catch (_) {
      /* ignore */
    }
  }

  setTimeout(() => {
    renderPoster(vibe, true);
    showPoster(true);
  }, 280);
}

// ---- Share ----
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
          text: `${vibe.emoji} ${vibe.name} — ${vibe.desc}`,
          files: [file]
        };
        if (navigator.canShare(payload)) {
          return navigator.share(payload);
        }
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

// ---- Share image: same poster language ----
function makeShareImage(v) {
  const W = 1080;
  const H = 1350;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  // Paper
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#f7f4ed");
  bg.addColorStop(1, "#ebe6db");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Lucky wash
  ctx.save();
  ctx.globalAlpha = 0.1;
  ctx.fillStyle = v.color;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();

  const cx = W / 2;
  let y = 120;

  // Date
  ctx.fillStyle = "#8a8378";
  ctx.font = "600 28px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.letterSpacing = "6px";
  const dateStr = `${formatDateLine(new Date(v.date + "T12:00:00"))}  ·  TODAY`;
  ctx.fillText(dateStr, cx, y);

  y += 100;

  // Emoji
  ctx.font = "120px sans-serif";
  ctx.fillText(v.emoji, cx, y);
  y += 110;

  // Name — adaptive size
  let nameSize = 72;
  if (v.name.length > 28) nameSize = 48;
  else if (v.name.length > 18) nameSize = 58;
  ctx.fillStyle = "#14120f";
  ctx.font = `800 ${nameSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  wrapText(ctx, v.name, cx, y, W - 160, nameSize * 1.1, 2);
  y += v.name.length > 18 ? nameSize * 2.2 : nameSize * 1.35;

  // Desc
  ctx.fillStyle = "#8a8378";
  ctx.font = "400 32px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  y = wrapText(ctx, v.desc, cx, y, W - 200, 44, 3) + 48;

  // Rule
  ctx.strokeStyle = "#d9d3c7";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 80, y);
  ctx.lineTo(cx + 80, y);
  ctx.stroke();
  y += 56;

  // Stats
  const labelX = 160;
  const scoreX = 320;
  const trackX = 360;
  const trackW = W - trackX - 160;

  for (let i = 0; i < DIMS.length; i++) {
    const sy = y + i * 58;
    ctx.fillStyle = "#8a8378";
    ctx.font = "650 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(DIMS[i].label.toUpperCase(), labelX, sy);

    ctx.fillStyle = "#14120f";
    ctx.font = "700 26px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(String(v.scores[i]), scoreX, sy);

    // track
    const ty = sy - 10;
    ctx.fillStyle = "rgba(20,18,15,0.08)";
    roundRect(ctx, trackX, ty, trackW, 8, 4);
    ctx.fill();

    const fw = trackW * (v.scores[i] / 10);
    if (fw > 0) {
      ctx.fillStyle = v.color;
      roundRect(ctx, trackX, ty, fw, 8, 4);
      ctx.fill();
    }
  }

  y += DIMS.length * 58 + 36;

  // Rule
  ctx.strokeStyle = "#d9d3c7";
  ctx.beginPath();
  ctx.moveTo(cx - 80, y);
  ctx.lineTo(cx + 80, y);
  ctx.stroke();
  y += 56;

  // Lucky
  const num = String(v.number).padStart(2, "0");
  ctx.textAlign = "center";
  // swatch
  ctx.fillStyle = v.color;
  roundRect(ctx, cx - 120, y - 18, 22, 22, 4);
  ctx.fill();

  ctx.fillStyle = "#8a8378";
  ctx.font = "600 26px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.fillText(`LUCKY   ${num}`, cx + 16, y);

  // Site
  ctx.fillStyle = "#c4bdb0";
  ctx.font = "500 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.fillText("todaysvibe.cc", cx, H - 72);

  return canvas.toDataURL("image/png");
}

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
  const words = text.split(" ");
  let line = "";
  let lines = 0;
  let cy = y;

  for (let n = 0; n < words.length; n++) {
    const test = line + words[n] + " ";
    if (ctx.measureText(test).width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, cy);
      line = words[n] + " ";
      cy += lineHeight;
      lines++;
      if (lines >= maxLines - 1) {
        // last line: dump rest
        const rest = words.slice(n).join(" ");
        let clipped = rest;
        while (ctx.measureText(clipped + "…").width > maxWidth && clipped.length > 1) {
          clipped = clipped.slice(0, -1);
        }
        ctx.fillText(clipped.trim() + (clipped !== rest ? "…" : ""), x, cy);
        return cy + lineHeight;
      }
    } else {
      line = test;
    }
  }
  ctx.fillText(line.trim(), x, cy);
  return cy + lineHeight;
}

// ---- Init ----
function init() {
  const dateText = formatDateLine();
  dom.coverDate.textContent = dateText;

  const saved = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
  if (saved && saved.date === todayISO()) {
    vibe = saved;
    renderPoster(vibe, false);
    showPoster(false);
  }

  dom.revealBtn.addEventListener("click", reveal);
  dom.shareBtn.addEventListener("click", share);
}

init();
