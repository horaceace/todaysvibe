// ============================================================
// Today's Vibe — Hex Chart with rotating backgrounds
// ============================================================

const STORE_KEY = 'todaysvibe_hex_v2';
const HIST_KEY = 'todaysvibe_hex_hist_v2';

const $ = (s) => document.querySelector(s);

// ---- 6 dimensions ----
const DIMS = [
  { key: 'energy',   label: 'Energy',   emoji: '⚡' },
  { key: 'chaos',    label: 'Chaos',    emoji: '🌪️' },
  { key: 'creative', label: 'Creative', emoji: '🎨' },
  { key: 'social',   label: 'Social',   emoji: '💬' },
  { key: 'focus',    label: 'Focus',    emoji: '🎯' },
  { key: 'mystic',   label: 'Mystic',   emoji: '🌙' },
];

// ---- 12 rotating backgrounds ----
const BACKGROUNDS = [
  { name: 'lavender',  css: 'linear-gradient(180deg, #f5f0ff 0%, #ede4fa 50%, #f8f5fc 100%)' },
  { name: 'peach',     css: 'linear-gradient(180deg, #fff5f0 0%, #ffe8dd 50%, #fdf6f3 100%)' },
  { name: 'mint',      css: 'linear-gradient(180deg, #f0faf5 0%, #ddf5e8 50%, #f5fcfa 100%)' },
  { name: 'sky',       css: 'linear-gradient(180deg, #f0f5fd 0%, #dde8fa 50%, #f5f8fc 100%)' },
  { name: 'rose',      css: 'linear-gradient(180deg, #fdf2f5 0%, #fce4e9 50%, #fef8f9 100%)' },
  { name: 'vanilla',   css: 'linear-gradient(180deg, #fefcf5 0%, #faf5e6 50%, #fefdf8 100%)' },
  { name: 'sunshine',  css: 'linear-gradient(180deg, #fffef5 0%, #fef9dd 50%, #fffef8 100%)' },
  { name: 'sage',      css: 'linear-gradient(180deg, #f4f7f0 0%, #e8efe0 50%, #f7f9f5 100%)' },
  { name: 'aqua',      css: 'linear-gradient(180deg, #f0f8f8 0%, #ddf0f2 50%, #f5fafa 100%)' },
  { name: 'lilac',     css: 'linear-gradient(180deg, #f6f2fc 0%, #ece0f8 50%, #f9f6fc 100%)' },
  { name: 'coral',     css: 'linear-gradient(180deg, #fff6f4 0%, #ffe8e2 50%, #fef9f7 100%)' },
  { name: 'butter',    css: 'linear-gradient(180deg, #fffef7 0%, #fef9e0 50%, #fffef9 100%)' },
];

// ---- DOM ----
const dom = {
  revealBtn: $('#reveal-btn'),
  result: $('#result'),
  slipEmoji: $('#slip-emoji'),
  resultName: $('#result-name'),
  resultDesc: $('#result-desc'),
  barsSection: $('#bars-section'),
  resultMeta: $('#result-meta'),
  shareBtn: $('#share-btn'),
  historySection: $('#history-section'),
  historyList: $('#history-list'),
  particleCanvas: $('#particles'),
};

let vibe = null;
let pctx = null;

// ---- Particles ----
function initParticles() {
  dom.particleCanvas.width = window.innerWidth;
  dom.particleCanvas.height = window.innerHeight;
  pctx = dom.particleCanvas.getContext('2d');
  window.addEventListener('resize', () => {
    dom.particleCanvas.width = window.innerWidth;
    dom.particleCanvas.height = window.innerHeight;
  });
}

const sparks = [];
function spawnSparks(x, y, color) {
  for (let i = 0; i < 40; i++) {
    const a = (Math.PI * 2 * i) / 40 + (Math.random() - 0.5) * 0.3;
    const spd = 2.5 + Math.random() * 5;
    sparks.push({ x, y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd, life: 1, decay: 0.014 + Math.random() * 0.024, size: 2 + Math.random() * 3, color });
  }
}
function animateSparks() {
  if (!sparks.length) return;
  pctx.clearRect(0, 0, dom.particleCanvas.width, dom.particleCanvas.height);
  for (let i = sparks.length - 1; i >= 0; i--) {
    const s = sparks[i];
    s.x += s.vx; s.y += s.vy; s.vy += 0.025; s.life -= s.decay;
    if (s.life <= 0) { sparks.splice(i, 1); continue; }
    const r = parseInt(s.color.slice(1,3),16), g = parseInt(s.color.slice(3,5),16), b = parseInt(s.color.slice(5,7),16);
    pctx.beginPath(); pctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI*2);
    pctx.fillStyle = `rgba(${r},${g},${b},${s.life})`; pctx.fill();
  }
  if (sparks.length) requestAnimationFrame(animateSparks);
}

// ---- Dimension Bars ----
function renderBars(scores, colorHex, animate = false) {
  dom.barsSection.innerHTML = DIMS.map((d, i) => `
    <div class="bar-row${animate ? '' : ' visible'}" style="--bar-width:${(scores[i]/10)*100}%;--bar-color:${colorHex}">
      <span class="bar-label">${d.label}</span>
      <div class="bar-track"><div class="bar-fill"></div></div>
      <span class="bar-score">${scores[i]}</span>
    </div>
  `).join('');

  if (animate) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        dom.barsSection.querySelectorAll('.bar-row').forEach((row, i) => {
          setTimeout(() => row.classList.add('visible'), i * 80);
        });
      });
    });
  }
}

// ---- Vibe Gen ----
function makeVibe() {
  const seed = getDateSeed();
  const rng = seededRandom(seed);

  const scores = DIMS.map(() => Math.floor(rng() * 10) + 1);
  const bg = pickFrom(BACKGROUNDS, rng);

  return {
    name: `${pickFrom(ADJECTIVES, rng)} ${pickFrom(NOUNS, rng)}`,
    desc: pickFrom(DESCRIPTIONS, rng),
    color: pickFrom(COLORS, rng),
    emoji: pickFrom(EMOJIS, rng),
    number: Math.floor(rng() * 99) + 1,
    scores,
    bg,
    date: new Date().toISOString().slice(0, 10),
  };
}

// ---- Persist ----
function loadOrCreate() {
  const saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
  const today = new Date().toISOString().slice(0, 10);
  if (saved && saved.date === today) return saved;

  const v = makeVibe();
  localStorage.setItem(STORE_KEY, JSON.stringify(v));

  const hist = JSON.parse(localStorage.getItem(HIST_KEY) || '[]');
  const f = hist.filter((h) => h.date !== v.date);
  f.push({ name: v.name, emoji: v.emoji, color: v.color, date: v.date });
  localStorage.setItem(HIST_KEY, JSON.stringify(f.slice(-14)));
  return v;
}

// ---- Render ----
function renderResult(v, animateChart = false) {
  document.body.style.background = v.bg.css;
  dom.result.style.setProperty('--card-accent', v.color);
  dom.slipEmoji.textContent = v.emoji;
  dom.resultName.textContent = v.name;
  dom.resultName.style.color = v.color;
  dom.resultDesc.textContent = v.desc;
  dom.resultMeta.innerHTML = `
    <span class="dot" style="background:${v.color}"></span>
    <span>lucky color</span>
    <span style="color:${v.color};font-weight:700">${v.number}</span>
  `;
  renderBars(v.scores, v.color, animateChart);
}

function renderHistory() {
  const hist = JSON.parse(localStorage.getItem(HIST_KEY) || '[]');
  const past = hist.filter((h) => h.date !== new Date().toISOString().slice(0, 10)).reverse();
  if (!past.length) { dom.historySection.style.display = 'none'; return; }
  dom.historySection.style.display = 'block';
  dom.historyList.innerHTML = past.map(v => `
    <div class="history-row">
      <span class="history-date">${fmtDate(v.date)}</span>
      <span class="history-emoji">${v.emoji}</span>
      <span class="history-name">${v.name}</span>
    </div>`).join('');
}

function fmtDate(iso) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ---- Reveal ----
function reveal() {
  vibe = loadOrCreate();
  renderResult(vibe, true);
  renderHistory();

  const r = dom.revealBtn.getBoundingClientRect();
  const cx = r.left + r.width/2, cy = r.top + r.height/2;

  dom.revealBtn.classList.add('hidden');
  requestAnimationFrame(() => {
    dom.result.classList.add('visible');
    dom.shareBtn.classList.add('visible');
    dom.historySection.classList.add('visible');
    spawnSparks(cx, cy, vibe.color);
    animateSparks();
  });
}

// ---- Share ----
function share() {
  const dataUrl = makeShareImage(vibe);
  if (navigator.share && navigator.canShare) {
    fetch(dataUrl).then(r => r.blob()).then(blob => {
      const file = new File([blob], `todaysvibe-${vibe.date}.png`, { type: 'image/png' });
      const sd = { title: "Today's Vibe", text: `${vibe.emoji} My vibe: ${vibe.name} — ${vibe.desc}`, files: [file] };
      if (navigator.canShare(sd)) navigator.share(sd).catch(() => download(dataUrl));
      else download(dataUrl);
    }).catch(() => download(dataUrl));
  } else download(dataUrl);
}
function download(url) {
  const a = document.createElement('a'); a.download = `todaysvibe-${vibe.date}.png`; a.href = url; a.click();
}

// ---- Share Image ----
function makeShareImage(v) {
  const SW = 1080, SH = 1350;
  const c = document.createElement('canvas'); c.width = SW; c.height = SH;
  const ctx = c.getContext('2d');
  const hr = parseInt(v.color.slice(1,3),16), hg = parseInt(v.color.slice(3,5),16), hb = parseInt(v.color.slice(5,7),16);
  const accent = `rgba(${hr},${hg},${hb},`;

  // BG
  ctx.fillStyle = '#faf8fc';
  ctx.fillRect(0, 0, SW, SH);

  // Card
  const cardX = 80, cardY = 80, cardW = SW - 160, cardH = SH - 160, cardR = 48;
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, cardR);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.strokeStyle = v.color; ctx.lineWidth = 5; ctx.stroke();

  // Top ornament line
  const topY = cardY + 70;
  ctx.beginPath(); ctx.moveTo(cardX + 60, topY); ctx.lineTo(cardX + cardW - 60, topY);
  ctx.strokeStyle = v.color; ctx.lineWidth = 2; ctx.globalAlpha = 0.3; ctx.stroke(); ctx.globalAlpha = 1;

  // Emoji circle
  const emoY = 260;
  ctx.beginPath(); ctx.arc(SW/2, emoY, 64, 0, Math.PI*2);
  ctx.fillStyle = accent + '0.12)'; ctx.fill();
  ctx.font = '72px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(v.emoji, SW/2, emoY + 2);

  // Name
  ctx.font = '900 64px "Inter", sans-serif'; ctx.fillStyle = v.color; ctx.textAlign = 'center';
  ctx.fillText(v.name, SW/2, 380);

  // Desc
  ctx.font = '400 30px "Inter", sans-serif'; ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.textAlign = 'center';
  ctx.fillText(v.desc, SW/2, 435);

  // Bars
  const barStartY = 500;
  for (let i = 0; i < 6; i++) {
    const y = barStartY + i * 70;
    // Label
    ctx.font = '600 26px "Inter", sans-serif'; ctx.fillStyle = '#888'; ctx.textAlign = 'right';
    ctx.fillText(DIMS[i].label, cardX + 160, y + 15);
    // Track
    ctx.beginPath();
    ctx.roundRect(cardX + 180, y, cardW - 280, 30, 15);
    ctx.fillStyle = '#f0ecf6'; ctx.fill();
    // Fill
    const fillW = (cardW - 280) * (v.scores[i] / 10);
    ctx.beginPath();
    ctx.roundRect(cardX + 180, y, fillW, 30, 15);
    ctx.fillStyle = v.color; ctx.fill();
    // Score
    ctx.font = '700 24px "Inter", sans-serif'; ctx.fillStyle = '#555'; ctx.textAlign = 'left';
    ctx.fillText(v.scores[i], cardX + cardW - 80, y + 15);
  }

  // Lucky number
  const luckyY = barStartY + 6 * 70 + 60;
  ctx.font = '600 24px "Inter", sans-serif'; ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.textAlign = 'center';
  ctx.fillText(`lucky number ${v.number}  ·  todaysvibe.lol`, SW/2, luckyY);

  // Bottom ornament
  const botY = cardY + cardH - 70;
  ctx.beginPath(); ctx.moveTo(cardX + 60, botY); ctx.lineTo(cardX + cardW - 60, botY);
  ctx.strokeStyle = v.color; ctx.lineWidth = 2; ctx.globalAlpha = 0.3; ctx.stroke(); ctx.globalAlpha = 1;

  return c.toDataURL('image/png');
}

// ---- Day color (before reveal, for button theming) ----
function getDayColor() {
  const rng = seededRandom(getDateSeed());
  return pickFrom(COLORS, rng);
}

// ---- Init ----
function init() {
  initParticles();
  // Apply day's accent color to CSS so button + wash match the vibe
  const dayColor = getDayColor();
  document.documentElement.style.setProperty('--day-color', dayColor);
  const dcR = parseInt(dayColor.slice(1,3),16);
  const dcG = parseInt(dayColor.slice(3,5),16);
  const dcB = parseInt(dayColor.slice(5,7),16);
  document.documentElement.style.setProperty('--day-color-rgb', `${dcR},${dcG},${dcB}`);

  const saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
  const today = new Date().toISOString().slice(0, 10);

  if (saved && saved.date === today) {
    vibe = saved;
    renderResult(vibe, false);
    renderHistory();
    dom.revealBtn.classList.add('hidden');
    dom.result.classList.add('visible');
    dom.shareBtn.classList.add('visible');
    dom.historySection.classList.add('visible');
  }

  dom.revealBtn.addEventListener('click', reveal);
  dom.shareBtn.addEventListener('click', share);
}

init();
