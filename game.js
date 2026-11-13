/* ============================================================
   WORLD CLASH 6 — meme-powered world leader fighting game
   Pure canvas + WebAudio. No external assets required.
   ============================================================ */
'use strict';

const W = 1280, H = 720;
const FLOOR = 628;
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const $ = id => document.getElementById(id);
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp = (a, b, t) => a + (b - a) * t;
const rand = (a = 0, b = 1) => a + Math.random() * (b - a);
const irand = (a, b) => Math.floor(rand(a, b + 1));
const choose = arr => arr[Math.floor(Math.random() * arr.length)];
const sign = v => v < 0 ? -1 : 1;
const TAU = Math.PI * 2;

/* ============================ ROSTER ============================ */
const CHARS = [
  {
    id: 'modi', name: 'MODI', full: 'NARENDRA MODI', country: 'INDIA', flag: '🇮🇳',
    tag: 'CHAI PE CHARCHA. CHAOS PE VAR.', special: 'MITRON WAVE', super: 'MANN KI BAAT',
    specialKind: 'cast', c1: '#ff9933', c2: '#1c8a3c', glow: '#ffb347',
    suit: '#efe4c5', suit2: '#d9caa5', shirt: '#fff7e2', tie: '#ff9933', pants: '#e8ddbd',
    skin: '#b97a4a', hair: '#ededed', hairStyle: 'modi', beard: 'white', glasses: true,
    speed: 1.00, power: 1.00, weight: 1.0, build: 1.04,
    quote: '“MITRON, THAT WAS A TREMENDOUS CHARCHA.”'
  },
  {
    id: 'xi', name: 'XI', full: 'XI JINPING', country: 'CHINA', flag: '🇨🇳',
    tag: 'YOUR SCORE HAS BEEN NOTED.', special: 'SOCIAL CREDIT', super: 'BELT & ROAD',
    specialKind: 'cast', c1: '#de2910', c2: '#ffde00', glow: '#ff4a3d',
    suit: '#24262d', suit2: '#181a20', shirt: '#e8e5dc', tie: '#de2910', pants: '#1c1e24',
    skin: '#d8a477', hair: '#17151a', hairStyle: 'short', beard: null, glasses: false,
    speed: 0.96, power: 1.09, weight: 1.05, build: 1.03,
    quote: '“SOCIAL CREDIT: +1000. DIPLOMATIC IMMUNITY: 0.”'
  },
  {
    id: 'putin', name: 'PUTIN', full: 'VLADIMIR PUTIN', country: 'RUSSIA', flag: '🇷🇺',
    tag: 'NO SHIRT. NO MERCY.', special: 'BEAR RUSH', super: 'SIBERIAN CAVALRY',
    specialKind: 'rush', c1: '#ffffff', c2: '#d52b1e', glow: '#6ab7ff',
    suit: '#3b404a', suit2: '#2b3038', shirt: '#e9eef2', tie: '#46505c', pants: '#30343c',
    skin: '#d9aa84', hair: '#a79880', hairStyle: 'short', beard: null, glasses: false, eyes: '#6fa8d8',
    speed: 1.02, power: 1.05, weight: 1.06, build: 1.02,
    quote: '“THE BEAR HAS ENTERED THE CHAT.”'
  },
  {
    id: 'zelensky', name: 'ZELENSKY', full: 'VOLODYMYR ZELENSKY', country: 'UKRAINE', flag: '🇺🇦',
    tag: 'I NEED AMMO, NOT A RIDE.', special: 'AMMO DROP', super: 'NOT A RIDE',
    specialKind: 'area', c1: '#ffd700', c2: '#0057b7', glow: '#ffd700',
    suit: '#58663e', suit2: '#454f31', shirt: '#58663e', tie: null, pants: '#353b2b', bareArms: true,
    skin: '#d5a17b', hair: '#3c3029', hairStyle: 'short', beard: 'stubble', glasses: false,
    speed: 1.05, power: 0.99, weight: 0.97, build: 0.98,
    quote: '“I DON’T NEED A RIDE. I NEED A COMBO.”'
  },
  {
    id: 'trump', name: 'TRUMP', full: 'DONALD TRUMP', country: 'USA', flag: '🇺🇸',
    tag: 'BIGLY. TREMENDOUS. YUGE.', special: 'COVFEFE', super: "YOU'RE FIRED",
    specialKind: 'cast', c1: '#3c3b6e', c2: '#b22234', glow: '#ffb347',
    suit: '#1d2a4d', suit2: '#141f3b', shirt: '#ffffff', tie: '#d61f2c', pants: '#182340', belly: true,
    skin: '#e8a25f', hair: '#f4d47f', hairStyle: 'swoop', beard: null, glasses: false,
    speed: 0.94, power: 1.15, weight: 1.16, build: 1.16,
    quote: '“THIS ROUND IS GOING TO BE TREMENDOUS.”'
  },
  {
    id: 'ramaphosa', name: 'RAMAPHOSA', full: 'CYRIL RAMAPHOSA', country: 'SOUTH AFRICA', flag: '🇿🇦',
    tag: 'STAGE 6. NO MERCY.', special: 'LOAD SHEDDING', super: 'PHALA PHALA',
    specialKind: 'cast', c1: '#007a4d', c2: '#ffb612', glow: '#ffd23f',
    suit: '#2b2f36', suit2: '#202329', shirt: '#f0eadc', tie: '#007a4d', pants: '#24272d',
    skin: '#6f4530', hair: '#c9c4ba', hairStyle: 'short', beard: 'grey', glasses: true,
    speed: 0.98, power: 1.04, weight: 1.03, build: 1.04,
    quote: '“THE LIGHTS ARE OFF. THE HANDS ARE NOT.”'
  },
  {
    id: 'boris', name: 'BORIS', full: 'BORIS JOHNSON', country: 'LONDON', flag: '🇬🇧',
    tag: 'WAVING FLAGS. MISSING RAILS.', special: 'ZIP LINE', super: 'PARTYGATE',
    specialKind: 'rush', c1: '#012169', c2: '#c8102e', glow: '#58d6ff',
    suit: '#1b2b4b', suit2: '#13203a', shirt: '#f6f4ec', tie: '#3d78c6', pants: '#182541',
    skin: '#e4ad85', hair: '#e8d28c', hairStyle: 'messy', beard: null, glasses: false, rosy: true,
    speed: 1.0, power: 1.02, weight: 1.05, build: 1.08,
    quote: '“I AM STILL ATTACHED TO THE ZIP WIRE.”'
  },
  {
    id: 'macron', name: 'MACRON', full: 'EMMANUEL MACRON', country: 'FRANCE', flag: '🇫🇷',
    tag: 'RETIREMENT? NOT TODAY.', special: 'BAGUETTE BOOMERANG', super: 'YELLOW VEST STORM',
    specialKind: 'cast', c1: '#0055a4', c2: '#ef4135', glow: '#ffd84d',
    suit: '#1e2c4c', suit2: '#16213a', shirt: '#f2f1e8', tie: '#24528f', pants: '#1b2742',
    skin: '#dfaf89', hair: '#3d312b', hairStyle: 'short', beard: 'stubble', glasses: false,
    speed: 1.07, power: 0.97, weight: 0.98, build: 0.99,
    quote: '“LA BAGUETTE HAS NO TERM LIMITS.”'
  },
  {
    id: 'shehbaz', name: 'SHEHBAZ', full: 'SHEHBAZ SHARIF', country: 'PAKISTAN', flag: '🇵🇰',
    tag: 'SPEED IS THE ONLY POLICY.', special: 'SPEED RUN', super: 'PUNJAB SPEED',
    specialKind: 'rush', c1: '#01411c', c2: '#f5f5f5', glow: '#67ffa8',
    suit: '#1c2420', suit2: '#131a17', shirt: '#f3efe3', tie: '#01411c', pants: '#1a211d',
    skin: '#b98257', hair: '#c4c0b6', hairStyle: 'short', beard: 'grey', glasses: true, build: 1.07,
    speed: 1.11, power: 0.98, weight: 1.04,
    quote: '“THE SPEED WAS NEVER THE PROBLEM.”'
  },
  {
    id: 'hasina', name: 'HASINA', full: 'SHEIKH HASINA', country: 'BANGLADESH', flag: '🇧🇩',
    tag: 'THE BENGAL TIGER AWAKENS.', special: 'TIGER ROAR', super: 'DELTA TIGER',
    specialKind: 'aura', c1: '#006a4e', c2: '#f42a41', glow: '#39ffb0',
    suit: '#0d6b52', suit2: '#09513f', shirt: '#0d6b52', tie: null, pants: '#0b5a45', saree: true,
    skin: '#c08b5c', hair: '#221a1a', hairStyle: 'bob', beard: null, glasses: false, bindi: true,
    speed: 1.03, power: 1.01, weight: 0.95, build: 0.92,
    quote: '“THE TIGER DOES NOT DO FRIENDLY DEBATES.”'
  },
  {
    id: 'prabowo', name: 'PRABOWO', full: 'PRABOWO SUBIANTO', country: 'INDONESIA', flag: '🇮🇩',
    tag: 'TOO CUTE TO FIGHT. STILL FIGHTING.', special: 'GEMOY GROOVE', super: 'GEMOY GLOBAL',
    specialKind: 'aura', c1: '#ce1126', c2: '#ffffff', glow: '#ff7edb',
    suit: '#c9bd9f', suit2: '#a99d7f', shirt: '#f7f3e8', tie: '#5b4a32', pants: '#2a2a2b', belly: true,
    skin: '#c68f5e', hair: '#c8c4b8', hairStyle: 'short', beard: 'moustache', glasses: false, rosy: true,
    speed: 0.93, power: 1.12, weight: 1.14, build: 1.11,
    quote: '“GEMOY IS A UNIVERSAL LANGUAGE.”'
  }
];
const CHAR_BY_ID = Object.fromEntries(CHARS.map(c => [c.id, c]));

const STAGES = [
  { id: 'desert', name: 'SUNSCORCHED SHOWDOWN', where: 'DUNE SEA', weather: 'sand' },
  { id: 'snow', name: 'FROZEN FRONT', where: 'POLAR ARENA', weather: 'snow' },
  { id: 'india', name: 'DELHI DUSK', where: 'RANGOLI RING', weather: 'petal' }
];

/* ============================ AUDIO ============================ */
class AudioEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.muted = false;
    this.musicTimer = null;
    this.step = 0;
    this.ready = false;
  }
  init() {
    if (this.ready) { this.resume(); return; }
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.32;
      this.master.connect(this.ctx.destination);
      this.ready = true;
      this.startMusic();
    } catch (e) { this.ready = false; }
  }
  resume() { if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume(); }
  toggle() {
    this.muted = !this.muted;
    if (this.master) this.master.gain.setTargetAtTime(this.muted ? 0 : 0.32, this.ctx.currentTime, 0.02);
    const b = $('muteBtn'); if (b) { b.textContent = this.muted ? '✕' : '♪'; b.classList.toggle('muted', this.muted); }
  }
  tone(freq, dur, type = 'square', vol = 0.1, slide = 0) {
    if (!this.ready || this.muted) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, freq * slide), t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(this.master);
    o.start(t); o.stop(t + dur + 0.02);
  }
  noise(dur = 0.1, vol = 0.18, hp = 400, lp = 4000) {
    if (!this.ready || this.muted) return;
    const t = this.ctx.currentTime;
    const len = Math.max(1, Math.floor(this.ctx.sampleRate * dur));
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = this.ctx.createBufferSource(); src.buffer = buf;
    const f = this.ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = lerp(hp, lp, Math.random());
    const g = this.ctx.createGain(); g.gain.value = vol;
    src.connect(f); f.connect(g); g.connect(this.master);
    src.start(t);
  }
  punch(heavy = false) {
    this.tone(heavy ? 90 : 150, heavy ? 0.16 : 0.09, 'sine', heavy ? 0.28 : 0.2, 0.4);
    this.noise(heavy ? 0.16 : 0.08, heavy ? 0.25 : 0.15, 300, 2400);
  }
  whoosh() { this.noise(0.1, 0.08, 700, 3200); }
  block() { this.tone(280, 0.07, 'square', 0.06, 0.7); this.noise(0.06, 0.1, 1400, 5000); }
  special() {
    this.tone(180, 0.5, 'sawtooth', 0.12, 3.4);
    this.tone(90, 0.55, 'sine', 0.16, 2.2);
    this.noise(0.3, 0.12, 500, 5000);
  }
  super() {
    this.tone(70, 1.1, 'sawtooth', 0.18, 2.4);
    this.tone(140, 1.0, 'square', 0.08, 3.0);
    this.noise(0.8, 0.18, 200, 6000);
  }
  ko() {
    this.tone(120, 0.7, 'sawtooth', 0.22, 0.25);
    this.tone(60, 0.9, 'sine', 0.25, 0.4);
    this.noise(0.4, 0.2, 100, 1800);
  }
  ui() { this.tone(640, 0.05, 'square', 0.05, 1.3); }
  crowd(intensity = 1) {
    if (!this.ready || this.muted) return;
    this.noise(0.5 * intensity, 0.05 * intensity, 500, 2500);
  }
  startMusic() {
    if (this.musicTimer) return;
    const bass = [55, 55, 82.4, 55, 61.7, 61.7, 82.4, 92.5];
    const arp = [220, 261.6, 329.6, 392, 329.6, 261.6, 440, 329.6];
    this.musicTimer = setInterval(() => {
      if (!this.ready || this.muted) return;
      const s = this.step % 16;
      if (s % 4 === 0) this.tone(55, 0.16, 'sine', 0.18, 0.7);
      if (s % 8 === 4) this.noise(0.05, 0.035, 2000, 8000);
      if (s % 2 === 0) this.noise(0.025, 0.02, 5000, 9000);
      if (s % 2 === 0) this.tone(bass[(s / 2) % 8], 0.18, 'triangle', 0.06, 0.9);
      if (s % 2 === 1) this.tone(arp[s % 8] * 2, 0.09, 'square', 0.018, 1);
      this.step++;
    }, 145);
  }
}
const audio = new AudioEngine();

/* ============================ INPUT ============================ */
const keys = new Set();
const pressed = new Set();
const touchHeld = new Set();
const touchPressed = new Set();
let audioUnlocked = false;

const P1MAP = { left: 'KeyA', right: 'KeyD', up: 'KeyW', block: 'KeyS', punch: 'KeyF', kick: 'KeyG', special: 'KeyH', super: 'KeyJ' };
const P2MAP = { left: 'ArrowLeft', right: 'ArrowRight', up: 'ArrowUp', block: 'ArrowDown', punch: 'KeyK', kick: 'KeyL', special: 'Semicolon', super: 'Quote' };

function unlockAudio() {
  if (!audioUnlocked) { audioUnlocked = true; audio.init(); }
  else audio.resume();
}
window.addEventListener('keydown', e => {
  if (['KeyA','KeyD','KeyW','KeyS','KeyF','KeyG','KeyH','KeyJ','KeyK','KeyL','Semicolon','Quote','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space','Enter','Escape','KeyP','KeyM'].includes(e.code)) e.preventDefault();
  if (!keys.has(e.code)) pressed.add(e.code);
  keys.add(e.code);
  unlockAudio();
  if (e.code === 'KeyM') audio.toggle();
  if (e.code === 'Escape' || e.code === 'KeyP') togglePause();
  if (e.code === 'Enter') handleEnter();
});
window.addEventListener('keyup', e => { keys.delete(e.code); });
window.addEventListener('blur', () => { keys.clear(); });
window.addEventListener('pointerdown', unlockAudio, { once: false });

function findTouch(code) { return touchHeld.has(code); }
function humanInput(index) {
  const map = index === 0 ? P1MAP : P2MAP;
  const pressedTouch = a => touchPressed.has(a) || pressed.has(map[a]);
  const heldTouch = a => touchHeld.has(a) || keys.has(map[a]);
  return {
    left: heldTouch('left'), right: heldTouch('right'), up: pressedTouch('up'),
    block: heldTouch('block'), punch: pressedTouch('punch'), kick: pressedTouch('kick'),
    special: pressedTouch('special'), super: pressedTouch('super')
  };
}
function bindTouchControls() {
  document.querySelectorAll('[data-touch]').forEach(btn => {
    const code = btn.dataset.touch;
    const down = e => {
      e.preventDefault();
      unlockAudio();
      if (!touchHeld.has(code)) touchPressed.add(code);
      touchHeld.add(code);
      btn.classList.add('pressed');
      try { btn.setPointerCapture(e.pointerId); } catch (_) {}
    };
    const up = e => {
      e.preventDefault();
      touchHeld.delete(code);
      btn.classList.remove('pressed');
    };
    btn.addEventListener('pointerdown', down);
    btn.addEventListener('pointerup', up);
    btn.addEventListener('pointercancel', up);
    btn.addEventListener('lostpointercapture', up);
    btn.addEventListener('contextmenu', e => e.preventDefault());
  });
}
bindTouchControls();

const isTouch = matchMedia('(pointer: coarse)').matches || ('ontouchstart' in window && navigator.maxTouchPoints > 0);
if (isTouch) document.body.classList.add('touch-mode');

function clearInputEdges() { pressed.clear(); touchPressed.clear(); }

/* ============================ DRAW HELPERS ============================ */
function makeCanvas(w, h) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; return c;
}
function rr(g, x, y, w, h, r) {
  r = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
  g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
}
function starPath(g, x, y, r1, r2, n, rot = 0) {
  g.beginPath();
  for (let i = 0; i < n * 2; i++) {
    const a = rot + i * Math.PI / n, r = i % 2 ? r2 : r1;
    const px = x + Math.cos(a) * r, py = y + Math.sin(a) * r;
    i ? g.lineTo(px, py) : g.moveTo(px, py);
  }
  g.closePath();
}
function halftone(g, x, y, w, h, step, color, radius = 2) {
  g.save(); g.fillStyle = color;
  for (let yy = y; yy < y + h; yy += step) {
    for (let xx = x + ((yy / step) % 2 ? step / 2 : 0); xx < x + w; xx += step) {
      g.beginPath(); g.arc(xx, yy, radius, 0, TAU); g.fill();
    }
  }
  g.restore();
}
function drawFlagBadge(g, x, y, w, h, c1, c2, vertical = false) {
  g.save();
  g.beginPath(); g.rect(x, y, w, h); g.clip();
  g.fillStyle = c1; g.fillRect(x, y, w, vertical ? h / 2 : h);
  g.fillStyle = c2; if (vertical) g.fillRect(x, y + h / 2, w, h / 2); else g.fillRect(x + w / 2, y, w / 2, h);
  g.restore();
  g.strokeStyle = 'rgba(0,0,0,.55)'; g.lineWidth = 1; g.strokeRect(x, y, w, h);
}

/* ============================ STAGE ART ============================ */
const stageBases = {};
const crowdData = {};
const weatherData = {};
const bannerSets = {
  desert: [['MITRON!', '#ffb347'], ['GEMOY', '#ff7edb'], ['BIGLY', '#ffd84d'], ['SPEED', '#67ffa8']],
  snow: [['BEAR RUSH', '#7fd6ff'], ['NO RIDE', '#ffd700'], ['COVFEFE', '#ff9a6a'], ['STAGE 6', '#b6ff4d']],
  india: [['CHAOS', '#ffd84d'], ['DELHI', '#ff8f5e'], ['GEMOY', '#ff7edb'], ['MITRON', '#b6ff4d']]
};

function buildStageBase(id) {
  const c = makeCanvas(W, H), g = c.getContext('2d');
  if (id === 'desert') {
    let sky = g.createLinearGradient(0, 0, 0, 520);
    sky.addColorStop(0, '#2b0c33'); sky.addColorStop(.32, '#83284a');
    sky.addColorStop(.62, '#ff6a42'); sky.addColorStop(1, '#ffc36a');
    g.fillStyle = sky; g.fillRect(0, 0, W, 540);
    // sun
    const sun = g.createRadialGradient(950, 210, 10, 950, 210, 210);
    sun.addColorStop(0, 'rgba(255,245,180,1)'); sun.addColorStop(.15, 'rgba(255,220,120,.92)');
    sun.addColorStop(.45, 'rgba(255,140,70,.28)'); sun.addColorStop(1, 'rgba(255,100,60,0)');
    g.fillStyle = sun; g.beginPath(); g.arc(950, 210, 210, 0, TAU); g.fill();
    g.fillStyle = '#fff2b0'; g.beginPath(); g.arc(950, 210, 78, 0, TAU); g.fill();
    // clouds
    g.fillStyle = 'rgba(80,20,55,.24)';
    for (let i = 0; i < 9; i++) { const x = i * 170 - 60, y = 110 + (i % 3) * 48; g.beginPath(); g.ellipse(x, y, 110, 13, -.06, 0, TAU); g.fill(); }
    // far mesas
    g.fillStyle = '#531c35';
    g.beginPath(); g.moveTo(0, 440); g.lineTo(0, 360); g.lineTo(120, 360); g.lineTo(160, 392); g.lineTo(300, 392); g.lineTo(330, 355); g.lineTo(430, 355); g.lineTo(460, 430); g.lineTo(640, 430); g.lineTo(690, 375); g.lineTo(800, 375); g.lineTo(830, 430); g.lineTo(1100, 430); g.lineTo(1140, 345); g.lineTo(1280, 345); g.lineTo(1280, 440); g.closePath(); g.fill();
    // pyramids
    g.fillStyle = 'rgba(68,22,30,.88)';
    g.beginPath(); g.moveTo(250, 488); g.lineTo(360, 380); g.lineTo(470, 488); g.closePath(); g.fill();
    g.fillStyle = 'rgba(255,190,120,.12)'; g.beginPath(); g.moveTo(360, 380); g.lineTo(470, 488); g.lineTo(408, 488); g.closePath(); g.fill();
    g.fillStyle = 'rgba(57,18,27,.82)';
    g.beginPath(); g.moveTo(430, 500); g.lineTo(535, 424); g.lineTo(640, 500); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(122, 500); g.lineTo(190, 446); g.lineTo(258, 500); g.closePath(); g.fill();
    // dunes
    g.fillStyle = '#b85b32'; g.beginPath(); g.moveTo(0, 500);
    g.bezierCurveTo(180, 440, 320, 500, 480, 470); g.bezierCurveTo(680, 430, 850, 505, 1100, 455);
    g.lineTo(1280, 470); g.lineTo(1280, 600); g.lineTo(0, 600); g.closePath(); g.fill();
    g.fillStyle = '#8e3c29'; g.beginPath(); g.moveTo(0, 530);
    g.bezierCurveTo(220, 490, 390, 540, 570, 505); g.bezierCurveTo(800, 465, 980, 545, 1280, 490);
    g.lineTo(1280, 620); g.lineTo(0, 620); g.closePath(); g.fill();
    // floor
    const fl = g.createLinearGradient(0, 575, 0, 720);
    fl.addColorStop(0, '#d98d4d'); fl.addColorStop(.5, '#b76535'); fl.addColorStop(1, '#71351f');
    g.fillStyle = fl; g.fillRect(0, 575, W, 145);
    g.strokeStyle = 'rgba(80,30,18,.35)'; g.lineWidth = 2;
    for (let i = -3; i < 14; i++) { g.beginPath(); g.moveTo(i * 120, 720); g.lineTo(640 + (i * 120 - 640) * .34, 578); g.stroke(); }
    for (let i = 0; i < 7; i++) { g.beginPath(); g.moveTo(0, 594 + i * 20 + i * i * 1.8); g.bezierCurveTo(300, 588 + i * 21, 800, 600 + i * 20, 1280, 590 + i * 22); g.stroke(); }
    // arena line
    g.strokeStyle = 'rgba(255,210,140,.45)'; g.lineWidth = 4; g.beginPath(); g.moveTo(70, 618); g.lineTo(1210, 618); g.stroke();
    g.strokeStyle = 'rgba(70,25,20,.35)'; g.lineWidth = 2; g.beginPath(); g.moveTo(100, 626); g.lineTo(1180, 626); g.stroke();
    // palms
    drawPalm(g, 96, 585, 1.25, '#5a241c', '#7d3223');
    drawPalm(g, 1200, 580, 1.05, '#4b1d19', '#6f2b1f');
    // tent far right
    g.fillStyle = 'rgba(55,20,25,.72)'; g.beginPath(); g.moveTo(1085, 520); g.lineTo(1160, 472); g.lineTo(1235, 520); g.closePath(); g.fill();
    g.fillStyle = 'rgba(255,180,90,.14)'; g.beginPath(); g.moveTo(1160, 472); g.lineTo(1235, 520); g.lineTo(1196, 520); g.closePath(); g.fill();
    // dust haze
    const hz = g.createLinearGradient(0, 470, 0, 620);
    hz.addColorStop(0, 'rgba(255,190,110,0)'); hz.addColorStop(1, 'rgba(255,190,110,.14)');
    g.fillStyle = hz; g.fillRect(0, 470, W, 150);
  }

  if (id === 'snow') {
    let sky = g.createLinearGradient(0, 0, 0, 500);
    sky.addColorStop(0, '#041025'); sky.addColorStop(.42, '#0c2b46');
    sky.addColorStop(.74, '#2c6784'); sky.addColorStop(1, '#9fd3e0');
    g.fillStyle = sky; g.fillRect(0, 0, W, 540);
    // stars
    g.fillStyle = 'rgba(255,255,255,.8)';
    for (let i = 0; i < 90; i++) {
      const x = (i * 137 + 41) % W, y = (i * 73 + 17) % 330, r = i % 7 === 0 ? 1.8 : .9;
      g.globalAlpha = .35 + (i % 5) * .12; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
    }
    g.globalAlpha = 1;
    // moon
    const moonG = g.createRadialGradient(208, 128, 4, 208, 128, 100);
    moonG.addColorStop(0, 'rgba(230,250,255,1)'); moonG.addColorStop(.16, 'rgba(200,240,255,.9)');
    moonG.addColorStop(.4, 'rgba(140,210,255,.16)'); moonG.addColorStop(1, 'rgba(100,180,255,0)');
    g.fillStyle = moonG; g.beginPath(); g.arc(208, 128, 100, 0, TAU); g.fill();
    g.fillStyle = '#eafaff'; g.beginPath(); g.arc(208, 128, 40, 0, TAU); g.fill();
    // far mountains
    g.fillStyle = '#315c73'; g.beginPath(); g.moveTo(0, 470);
    g.lineTo(0, 360); g.lineTo(130, 240); g.lineTo(245, 370); g.lineTo(360, 265); g.lineTo(520, 420);
    g.lineTo(650, 300); g.lineTo(790, 420); g.lineTo(930, 255); g.lineTo(1090, 410); g.lineTo(1190, 330); g.lineTo(1280, 390);
    g.lineTo(1280, 500); g.lineTo(0, 500); g.closePath(); g.fill();
    g.fillStyle = 'rgba(225,248,255,.6)'; g.beginPath();
    g.moveTo(130, 240); g.lineTo(185, 305); g.lineTo(150, 300); g.lineTo(130, 322); g.lineTo(100, 288); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(360, 265); g.lineTo(430, 345); g.lineTo(390, 332); g.lineTo(366, 355); g.lineTo(330, 320); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(650, 300); g.lineTo(715, 370); g.lineTo(676, 356); g.lineTo(650, 382); g.lineTo(614, 344); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(930, 255); g.lineTo(995, 330); g.lineTo(956, 318); g.lineTo(930, 344); g.lineTo(892, 306); g.closePath(); g.fill();
    // near ridge / pines
    g.fillStyle = '#173847'; g.beginPath(); g.moveTo(0, 505); g.bezierCurveTo(180, 460, 350, 520, 560, 492); g.bezierCurveTo(780, 462, 980, 525, 1280, 470); g.lineTo(1280, 600); g.lineTo(0, 600); g.closePath(); g.fill();
    for (let i = 0; i < 18; i++) drawPine(g, 35 + i * 76 + (i % 3) * 12, 505 + (i % 4) * 9, .5 + (i % 4) * .12, '#0d2632');
    // ice floor
    const fl = g.createLinearGradient(0, 575, 0, 720);
    fl.addColorStop(0, '#b8e1ec'); fl.addColorStop(.45, '#83b9cb'); fl.addColorStop(1, '#3d6f84');
    g.fillStyle = fl; g.fillRect(0, 575, W, 145);
    // scratches
    g.strokeStyle = 'rgba(255,255,255,.32)'; g.lineWidth = 2;
    for (let i = 0; i < 20; i++) {
      const x = (i * 191) % W, y = 620 + (i * 43) % 95;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + 60 + (i % 4) * 30, y + 16); g.stroke();
    }
    g.strokeStyle = 'rgba(20,70,90,.35)'; g.lineWidth = 2;
    for (let i = 0; i < 9; i++) {
      const x = (i * 277 + 90) % W;
      g.beginPath(); g.moveTo(x, 680); g.lineTo(x - 24, 650); g.lineTo(x - 8, 630); g.lineTo(x - 46, 610); g.stroke();
    }
    // snow banks
    g.fillStyle = 'rgba(235,250,255,.85)';
    g.beginPath(); g.ellipse(60, 660, 180, 36, 0, 0, TAU); g.fill();
    g.beginPath(); g.ellipse(1230, 675, 210, 40, 0, 0, TAU); g.fill();
    g.beginPath(); g.ellipse(300, 715, 220, 32, 0, 0, TAU); g.fill();
    g.strokeStyle = 'rgba(220,250,255,.5)'; g.lineWidth = 4; g.beginPath(); g.moveTo(70, 618); g.lineTo(1210, 618); g.stroke();
  }

  if (id === 'india') {
    let sky = g.createLinearGradient(0, 0, 0, 540);
    sky.addColorStop(0, '#22082f'); sky.addColorStop(.36, '#62164f');
    sky.addColorStop(.68, '#dd3f58'); sky.addColorStop(1, '#ffae4a');
    g.fillStyle = sky; g.fillRect(0, 0, W, 540);
    // sun glow
    const sun = g.createRadialGradient(1000, 300, 8, 1000, 300, 190);
    sun.addColorStop(0, 'rgba(255,235,150,1)'); sun.addColorStop(.18, 'rgba(255,200,100,.9)');
    sun.addColorStop(.5, 'rgba(255,120,80,.22)'); sun.addColorStop(1, 'rgba(255,90,70,0)');
    g.fillStyle = sun; g.beginPath(); g.arc(1000, 300, 190, 0, TAU); g.fill();
    g.fillStyle = '#ffde8a'; g.beginPath(); g.arc(1000, 300, 58, 0, TAU); g.fill();
    // clouds
    g.fillStyle = 'rgba(50,10,60,.3)';
    for (let i = 0; i < 8; i++) { const x = i * 190 - 90, y = 80 + (i % 3) * 55; g.beginPath(); g.ellipse(x, y, 125, 16, -.04, 0, TAU); g.fill(); }
    // kites
    for (let i = 0; i < 7; i++) {
      const kx = 150 + i * 150, ky = 120 + (i % 4) * 40;
      g.strokeStyle = 'rgba(255,220,150,.18)'; g.lineWidth = 1; g.beginPath(); g.moveTo(kx, ky); g.lineTo(kx + 70 + i * 4, 520); g.stroke();
      g.fillStyle = ['#ffd84d', '#ff6e9c', '#39e6ff', '#b6ff4d'][i % 4];
      g.beginPath(); g.moveTo(kx, ky); g.lineTo(kx + 9, ky + 12); g.lineTo(kx, ky + 24); g.lineTo(kx - 9, ky + 12); g.closePath(); g.fill();
    }
    // distant skyline
    g.fillStyle = '#3a1330';
    const skyline = [[0,430],[40,430],[40,392],[74,392],[74,430],[130,430],[130,360],[152,360],[152,430],[210,430],[210,406],[260,406],[260,430],[330,430],[330,382],[352,382],[352,430],[420,430],[420,350],[446,350],[446,430],[520,430],[520,400],[580,400],[580,430],[650,430],[650,372],[672,372],[672,430],[740,430],[740,390],[790,390],[790,430],[860,430],[860,342],[884,342],[884,430],[960,430],[960,398],[1010,398],[1010,430],[1080,430],[1080,366],[1102,366],[1102,430],[1170,430],[1170,402],[1220,402],[1220,430],[1280,430],[1280,540],[0,540]];
    g.beginPath(); g.moveTo(skyline[0][0], skyline[0][1]); skyline.forEach(p => g.lineTo(p[0], p[1])); g.closePath(); g.fill();
    // windows
    g.fillStyle = 'rgba(255,214,120,.55)';
    for (let i = 0; i < 60; i++) { const x = 30 + (i * 89) % 1210, y = 370 + (i * 47) % 66; g.fillRect(x, y, 3, 4); }
    // India Gate
    g.fillStyle = '#2a0d26'; g.fillRect(566, 398, 148, 144);
    g.fillStyle = '#1c081b'; g.beginPath(); g.moveTo(566, 398); g.lineTo(588, 360); g.lineTo(692, 360); g.lineTo(714, 398); g.closePath(); g.fill();
    g.fillStyle = '#3a1330'; g.beginPath(); g.arc(640, 402, 74, Math.PI, TAU); g.fill();
    g.fillStyle = '#140712'; g.beginPath(); g.arc(640, 470, 34, Math.PI, TAU); g.lineTo(674, 542); g.lineTo(606, 542); g.closePath(); g.fill();
    g.fillStyle = 'rgba(255,190,100,.35)'; g.fillRect(556, 536, 168, 8);
    // festival string lights
    for (let s = 0; s < 2; s++) {
      g.strokeStyle = 'rgba(30,8,25,.8)'; g.lineWidth = 1;
      g.beginPath(); g.moveTo(0, 330 + s * 28);
      g.bezierCurveTo(320, 390 + s * 26, 800, 300 + s * 32, 1280, 360 + s * 22); g.stroke();
      for (let i = 0; i < 28; i++) {
        const p = i / 27, x = 0 + 1280 * p;
        const y = 330 + s * 28 + Math.sin(p * Math.PI) * (62 - s * 6) + Math.sin(p * 9) * 5;
        g.fillStyle = ['#ffd84d', '#ff7e5f', '#ff4f8f', '#8cffd0'][i % 4];
        g.globalAlpha = .55; g.beginPath(); g.arc(x, y, 2.6, 0, TAU); g.fill();
      }
      g.globalAlpha = 1;
    }
    // crowd barrier / stage decor
    g.fillStyle = 'rgba(30,8,25,.75)'; g.fillRect(0, 505, W, 42);
    g.fillStyle = 'rgba(255,170,70,.12)'; g.fillRect(0, 505, W, 4);
    // floor
    const fl = g.createLinearGradient(0, 570, 0, 720);
    fl.addColorStop(0, '#9a6b52'); fl.addColorStop(.5, '#744936'); fl.addColorStop(1, '#42241e');
    g.fillStyle = fl; g.fillRect(0, 570, W, 150);
    // tiles
    g.strokeStyle = 'rgba(255,205,150,.13)'; g.lineWidth = 2;
    for (let i = 0; i < 12; i++) {
      g.beginPath(); g.moveTo(i * 130 - 80, 720); g.lineTo(640 + (i * 130 - 720) * .3, 580); g.stroke();
    }
    for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(0, 600 + i * 24); g.lineTo(1280, 600 + i * 24); g.stroke(); }
    // rangoli
    drawRangoli(g, 640, 668, 150);
    g.strokeStyle = 'rgba(255,200,120,.4)'; g.lineWidth = 3; g.beginPath(); g.moveTo(60, 620); g.lineTo(1220, 620); g.stroke();
    // marigold garlands at the sides
    for (let i = 0; i < 14; i++) {
      const x = 60 + i * 12, y = 512 + Math.sin(i * .9) * 10;
      g.fillStyle = i % 2 ? '#ff9a1f' : '#ffcf3d'; g.beginPath(); g.arc(x, y, 6, 0, TAU); g.fill();
    }
    for (let i = 0; i < 14; i++) {
      const x = 1170 + i * 8, y = 516 + Math.cos(i * .9) * 12;
      g.fillStyle = i % 2 ? '#ff4f6d' : '#ffb347'; g.beginPath(); g.arc(x, y, 6, 0, TAU); g.fill();
    }
  }
  return c;
}

function drawPalm(g, x, baseY, s, trunk, leaf) {
  g.save(); g.translate(x, baseY); g.scale(s, s);
  g.strokeStyle = trunk; g.lineWidth = 12; g.lineCap = 'round';
  g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(-8, -80, 18, -150); g.stroke();
  g.fillStyle = leaf;
  for (let i = 0; i < 7; i++) {
    const a = -Math.PI / 2 + (i - 3) * .42;
    g.beginPath(); g.moveTo(18, -150);
    g.quadraticCurveTo(18 + Math.cos(a) * 52, -150 + Math.sin(a) * 52 - 14, 18 + Math.cos(a) * 92, -150 + Math.sin(a) * 92 + 22);
    g.quadraticCurveTo(18 + Math.cos(a) * 50, -150 + Math.sin(a) * 50 + 16, 18, -150); g.fill();
  }
  g.restore();
}
function drawPine(g, x, baseY, s, color) {
  g.save(); g.translate(x, baseY); g.scale(s, s); g.fillStyle = color;
  g.beginPath(); g.moveTo(0, -110); g.lineTo(34, 0); g.lineTo(-34, 0); g.closePath(); g.fill();
  g.fillStyle = 'rgba(220,245,252,.42)';
  g.beginPath(); g.moveTo(0, -110); g.lineTo(14, -72); g.lineTo(4, -80); g.lineTo(0, -62); g.lineTo(-10, -80); g.closePath(); g.fill();
  g.restore();
}
function drawRangoli(g, x, y, r) {
  g.save(); g.translate(x, y); g.scale(1, .36);
  const colors = ['#ffcf3d', '#ff6e6e', '#39e6c8', '#ff9a3c', '#f9f1d0'];
  for (let ring = 4; ring >= 0; ring--) {
    g.strokeStyle = colors[ring % colors.length]; g.globalAlpha = .22 + ring * .05; g.lineWidth = 4;
    g.beginPath(); g.arc(0, 0, r * (ring + 1) / 5, 0, TAU); g.stroke();
  }
  for (let i = 0; i < 20; i++) {
    const a = i / 20 * TAU;
    g.fillStyle = colors[i % colors.length]; g.globalAlpha = .3;
    g.beginPath(); g.ellipse(Math.cos(a) * r * .62, Math.sin(a) * r * .62, 12, 5, a, 0, TAU); g.fill();
  }
  g.globalAlpha = .28; g.fillStyle = '#fff2c0'; g.beginPath(); g.arc(0, 0, 18, 0, TAU); g.fill();
  g.restore();
}

function initCrowdAndWeather() {
  const crowds = ['desert', 'snow', 'india'];
  for (const id of crowds) {
    const arr = [];
    for (let i = 0; i < 38; i++) {
      arr.push({
        x: -20 + i * 35 + rand(-8, 8), y: 520 + rand(0, 18),
        s: rand(.72, 1.15), phase: rand(0, TAU), tone: rand(0, 1),
        phone: Math.random() < .28
      });
    }
    crowdData[id] = arr;
    const w = [];
    const count = id === 'snow' ? 130 : id === 'desert' ? 70 : 55;
    for (let i = 0; i < count; i++) {
      w.push({ x: rand(0, W), y: rand(-40, H), s: rand(.5, 1.7), vx: rand(-.5, .5), vy: rand(.3, 1.3), phase: rand(0, TAU), rot: rand(0, TAU), vr: rand(-.02, .02) });
    }
    weatherData[id] = w;
  }
}

function drawCrowd(g, id, t) {
  const arr = crowdData[id] || [];
  const colors = id === 'india' ? ['#2a0e26', '#40132e', '#35101f'] : id === 'snow' ? ['#0b2430', '#102d3a', '#143543'] : ['#3a1728', '#4a1d2c', '#2c1220'];
  for (const p of arr) {
    const bob = Math.sin(t * 2.2 + p.phase) * 3;
    g.save(); g.translate(p.x, p.y + bob); g.scale(p.s, p.s);
    g.fillStyle = colors[Math.floor(p.tone * colors.length) % colors.length];
    rr(g, -18, 16, 36, 42, 10); g.fill();
    g.beginPath(); g.arc(0, 2, 12, 0, TAU); g.fill();
    if (id === 'snow') { g.fillStyle = 'rgba(200,240,255,.55)'; g.beginPath(); g.arc(0, -7, 12, Math.PI, TAU); g.fill(); }
    if (id === 'desert') { g.fillStyle = 'rgba(255,180,100,.2)'; g.beginPath(); g.arc(0, -4, 12, Math.PI, TAU); g.fill(); }
    if (p.phone) {
      g.fillStyle = 'rgba(220,255,255,.8)'; g.shadowColor = '#bff9ff'; g.shadowBlur = 10;
      g.fillRect(8, 22, 4, 7); g.shadowBlur = 0;
    }
    g.restore();
  }
  // banners
  const banners = bannerSets[id] || [];
  banners.forEach((b, i) => {
    const x = 210 + i * 290 + Math.sin(t * 1.1 + i) * 5;
    const y = 500 + Math.sin(t * 1.7 + i) * 3;
    g.save(); g.translate(x, y); g.rotate(Math.sin(t + i) * .04 - .04);
    g.fillStyle = 'rgba(8,8,13,.78)'; g.fillRect(-62, -18, 124, 30);
    g.strokeStyle = b[1]; g.lineWidth = 2; g.strokeRect(-62, -18, 124, 30);
    g.fillStyle = b[1]; g.font = 'italic 700 17px Clash, Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(b[0], 0, 0);
    g.strokeStyle = 'rgba(244,240,230,.25)'; g.lineWidth = 2; g.beginPath(); g.moveTo(-52, 12); g.lineTo(-62, 34); g.moveTo(52, 12); g.lineTo(62, 34); g.stroke();
    g.restore();
  });
}

function drawStageDynamic(g, id, t) {
  // sun / moon glow breathing
  if (id === 'desert') {
    g.save(); g.globalAlpha = .1;
    g.strokeStyle = '#ffd39a'; g.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
      const y = 430 + i * 26 + Math.sin(t * 2 + i) * 3;
      g.beginPath();
      for (let x = 0; x <= W; x += 40) g.lineTo(x, y + Math.sin(x * .012 + t * 1.8 + i) * 4);
      g.stroke();
    }
    g.restore();
    // torches
    for (const x of [118, 1162]) {
      const fl = 18 + Math.sin(t * 9 + x) * 6;
      g.save(); g.translate(x, 512); g.fillStyle = 'rgba(255,150,50,.16)'; g.beginPath(); g.arc(0, -fl, 46, 0, TAU); g.fill();
      g.fillStyle = '#ffcf5c'; g.beginPath(); g.ellipse(0, -fl, 7, fl * .7, 0, 0, TAU); g.fill();
      g.fillStyle = '#ff6a2c'; g.beginPath(); g.ellipse(0, -fl * .7, 5, fl * .4, 0, 0, TAU); g.fill(); g.restore();
    }
  }
  if (id === 'snow') {
    g.save(); g.globalAlpha = .33;
    const aur = g.createLinearGradient(0, 100, W, 280);
    aur.addColorStop(0, 'rgba(56,255,156,0)'); aur.addColorStop(.25, 'rgba(56,255,156,.32)');
    aur.addColorStop(.5, 'rgba(32,230,255,.07)'); aur.addColorStop(.72, 'rgba(139,92,255,.28)'); aur.addColorStop(1, 'rgba(139,92,255,0)');
    g.fillStyle = aur;
    g.beginPath(); g.moveTo(0, 180);
    for (let x = 0; x <= W; x += 40) g.lineTo(x, 175 + Math.sin(x * .007 + t * .35) * 45 + Math.sin(x * .017 - t * .22) * 18);
    for (let x = W; x >= 0; x -= 40) g.lineTo(x, 245 + Math.sin(x * .006 - t * .28) * 55);
    g.closePath(); g.fill();
    g.restore();
    // snow sparkle on floor
    g.save(); g.globalAlpha = .25;
    for (let i = 0; i < 18; i++) { const x = (i * 127 + Math.sin(t + i) * 20) % W; g.fillStyle = '#fff'; g.fillRect(x, 640 + (i * 31) % 55, 2, 2); }
    g.restore();
  }
  if (id === 'india') {
    // twinkling lights and sparkles
    g.save();
    for (let i = 0; i < 28; i++) {
      const p = i / 27, x = p * W;
      const y = 330 + Math.sin(p * Math.PI) * 62 + Math.sin(p * 9) * 5;
      const a = .35 + Math.sin(t * 4 + i * 1.7) * .35;
      g.globalAlpha = clamp(a, 0, 1); g.fillStyle = ['#ffd84d', '#ff7e5f', '#ff4f8f', '#8cffd0'][i % 4];
      g.beginPath(); g.arc(x, y, 3.2, 0, TAU); g.fill();
    }
    g.restore();
    // floating diyas / petals glow
    g.save(); g.globalAlpha = .5;
    for (let i = 0; i < 7; i++) {
      const x = 110 + i * 170, y = 580 + Math.sin(t * 1.4 + i) * 4;
      g.fillStyle = 'rgba(255,200,80,.22)'; g.beginPath(); g.arc(x, y, 16, 0, TAU); g.fill();
      g.fillStyle = '#ffcf5c'; g.beginPath(); g.ellipse(x, y, 5, 2, 0, 0, TAU); g.fill();
    }
    g.restore();
  }
  drawCrowd(g, id, t);
  drawWeather(g, id, t);
}

function drawWeather(g, id, t) {
  const arr = weatherData[id] || [];
  if (id === 'desert') {
    g.save(); g.globalAlpha = .35;
    for (const p of arr) {
      const x = ((p.x + t * 28 + Math.sin(t + p.phase) * 15) % (W + 80)) - 40;
      const y = 560 + Math.sin(t * .8 + p.phase) * 15 + p.y * .1;
      g.fillStyle = 'rgba(255,210,150,.55)'; g.fillRect(x, y, p.s * 7, 1.2);
    }
    g.restore();
  } else if (id === 'snow') {
    g.save();
    for (const p of arr) {
      const y = ((p.y + t * 38 * p.vy + 40) % (H + 40)) - 20;
      const x = ((p.x + Math.sin(t * .7 + p.phase) * 24 + t * p.vx * 10) % (W + 40)) - 20;
      g.globalAlpha = .35 + p.s * .3; g.fillStyle = '#fff';
      g.beginPath(); g.arc(x, y, p.s * 1.7, 0, TAU); g.fill();
    }
    g.restore();
  } else {
    g.save();
    for (const p of arr) {
      const y = ((p.y + t * 20 * p.vy + 50) % (H + 60)) - 30;
      const x = ((p.x + Math.sin(t * .6 + p.phase) * 40 + t * 8) % (W + 40)) - 20;
      g.globalAlpha = .5 + p.s * .25; g.fillStyle = p.phase > 3 ? '#ffb347' : '#ff5f7e';
      g.save(); g.translate(x, y); g.rotate(t * .6 + p.rot);
      g.beginPath(); g.ellipse(0, 0, p.s * 4.2, p.s * 2, 0, 0, TAU); g.fill(); g.restore();
    }
    g.restore();
  }
}

/* ============================ CHARACTER ART ============================ */
function drawHead(g, ch, x, y, scale, t, expr = 'idle') {
  g.save();
  g.translate(x, y); g.scale(scale, scale);
  const skin = ch.skin;
  const dark = 'rgba(30,14,12,.82)';
  const browY = expr === 'angry' ? -9 : -10;
  const eyeY = -3;
  const blink = Math.sin(t * 1.7 + ch.name.length) > .985;
  // ears
  g.fillStyle = skin;
  g.beginPath(); g.ellipse(-23, 3, 6, 9, -.1, 0, TAU); g.fill();
  g.beginPath(); g.ellipse(23, 3, 6, 9, .1, 0, TAU); g.fill();
  // back hair
  if (['bob'].includes(ch.hairStyle)) {
    g.fillStyle = ch.hair;
    g.beginPath(); g.ellipse(0, -2, 29, 34, 0, 0, TAU); g.fill();
    g.beginPath(); g.ellipse(-22, 15, 9, 18, .1, 0, TAU); g.fill();
    g.beginPath(); g.ellipse(22, 15, 9, 18, -.1, 0, TAU); g.fill();
  }
  // face
  g.fillStyle = skin;
  g.beginPath();
  g.moveTo(-22, -19);
  g.bezierCurveTo(-25, 2, -20, 21, 0, 31);
  g.bezierCurveTo(20, 21, 25, 2, 22, -19);
  g.bezierCurveTo(16, -35, -16, -35, -22, -19);
  g.closePath(); g.fill();
  // jaw shading
  g.fillStyle = 'rgba(90,40,25,.08)';
  g.beginPath(); g.ellipse(0, 22, 16, 7, 0, 0, TAU); g.fill();
  // rosy cheeks
  if (ch.rosy) {
    g.fillStyle = 'rgba(215,80,70,.16)';
    g.beginPath(); g.ellipse(-13, 10, 7, 4, 0, 0, TAU); g.fill();
    g.beginPath(); g.ellipse(13, 10, 7, 4, 0, 0, TAU); g.fill();
  }
  // hair front
  drawHair(g, ch, t);
  // brows
  g.strokeStyle = ch.hairStyle === 'modi' ? '#ddd' : (ch.hair === '#f3d886' ? '#b98c3b' : 'rgba(35,24,20,.9)');
  g.lineWidth = 2.6; g.lineCap = 'round';
  if (expr === 'angry' || expr === 'super') {
    g.beginPath(); g.moveTo(-16, browY + 1); g.lineTo(-5, browY - 4); g.stroke();
    g.beginPath(); g.moveTo(16, browY + 1); g.lineTo(5, browY - 4); g.stroke();
  } else if (expr === 'hurt' || expr === 'ko') {
    g.beginPath(); g.moveTo(-16, browY - 2); g.lineTo(-6, browY + 1); g.stroke();
    g.beginPath(); g.moveTo(16, browY - 2); g.lineTo(6, browY + 1); g.stroke();
  } else {
    g.beginPath(); g.moveTo(-15, browY); g.lineTo(-6, browY - 1); g.stroke();
    g.beginPath(); g.moveTo(15, browY); g.lineTo(6, browY - 1); g.stroke();
  }
  // eyes
  if (expr === 'ko') {
    g.strokeStyle = dark; g.lineWidth = 2.4;
    for (const ex of [-10, 10]) {
      g.beginPath(); g.moveTo(ex - 4, eyeY - 3); g.lineTo(ex + 4, eyeY + 3); g.moveTo(ex + 4, eyeY - 3); g.lineTo(ex - 4, eyeY + 3); g.stroke();
    }
  } else if (expr === 'hurt' || blink) {
    g.strokeStyle = dark; g.lineWidth = 2;
    g.beginPath(); g.moveTo(-15, eyeY); g.lineTo(-5, eyeY); g.stroke();
    g.beginPath(); g.moveTo(5, eyeY); g.lineTo(15, eyeY); g.stroke();
  } else if (expr === 'win') {
    g.strokeStyle = dark; g.lineWidth = 2;
    g.beginPath(); g.arc(-10, eyeY + 2, 5, Math.PI * 1.1, Math.PI * 1.9); g.stroke();
    g.beginPath(); g.arc(10, eyeY + 2, 5, Math.PI * 1.1, Math.PI * 1.9); g.stroke();
  } else {
    g.fillStyle = '#fbf7ee';
    const eyeH = ch.id === 'trump' ? 3.2 : (expr === 'super' ? 5 : 4.2);
    for (const ex of [-10, 10]) {
      g.beginPath(); g.ellipse(ex, eyeY, 5.8, eyeH, 0, 0, TAU); g.fill();
      g.fillStyle = ch.eyes || '#3a2a22'; g.beginPath(); g.arc(ex + (ex > 0 ? -1 : 1), eyeY + .4, 2.3, 0, TAU); g.fill();
      g.fillStyle = 'rgba(255,255,255,.8)'; g.beginPath(); g.arc(ex + (ex > 0 ? -1.6 : .6), eyeY - 1.4, 1, 0, TAU); g.fill();
      g.fillStyle = '#fbf7ee';
    }
    if (ch.id === 'trump' || ch.id === 'boris') {
      g.strokeStyle = 'rgba(110,60,35,.25)'; g.lineWidth = 1.4;
      g.beginPath(); g.moveTo(-15, eyeY + 6); g.quadraticCurveTo(-10, eyeY + 8, -5, eyeY + 6); g.stroke();
      g.beginPath(); g.moveTo(5, eyeY + 6); g.quadraticCurveTo(10, eyeY + 8, 15, eyeY + 6); g.stroke();
    }
  }
  // nose
  g.strokeStyle = 'rgba(80,42,28,.55)'; g.lineWidth = 1.8; g.lineCap = 'round';
  g.beginPath(); g.moveTo(-1, 1); g.quadraticCurveTo(3, 8, -1, 10); g.stroke();
  // moustache / beard
  if (ch.beard === 'full' || ch.beard === 'white' || ch.beard === 'grey' || ch.beard === 'dark') {
    const bc = ch.hairStyle === 'modi' ? 'rgba(236,236,236,.96)' : (ch.beard === 'grey' ? 'rgba(185,185,180,.95)' : 'rgba(46,36,30,.92)');
    g.fillStyle = bc;
    g.beginPath();
    g.moveTo(-22, 4);
    g.quadraticCurveTo(-25, 26, 0, 33);
    g.quadraticCurveTo(25, 26, 22, 4);
    g.quadraticCurveTo(18, 16, 0, 16);
    g.quadraticCurveTo(-18, 16, -22, 4);
    g.fill();
    // moustache
    g.beginPath(); g.ellipse(0, 14, 10, 4.2, 0, 0, TAU); g.fill();
    // mouth hole
    g.fillStyle = 'rgba(95,40,35,.65)'; g.beginPath(); g.ellipse(0, 22, 5, 2.4, 0, 0, TAU); g.fill();
  } else if (ch.beard === 'stubble') {
    g.fillStyle = 'rgba(46,36,30,.28)';
    g.beginPath(); g.moveTo(-20, 8); g.quadraticCurveTo(-18, 25, 0, 30); g.quadraticCurveTo(18, 25, 20, 8); g.quadraticCurveTo(14, 18, 0, 18); g.quadraticCurveTo(-14, 18, -20, 8); g.fill();
  } else if (ch.beard === 'moustache') {
    g.fillStyle = 'rgba(170,166,158,.95)';
    g.beginPath(); g.ellipse(0, 14, 11, 4.6, 0, 0, TAU); g.fill();
  }
  // mouth
  if (!ch.beard || ch.beard === 'stubble' || ch.beard === 'moustache') {
    g.strokeStyle = 'rgba(85,38,32,.75)'; g.lineWidth = 2;
    if (expr === 'super') {
      g.fillStyle = 'rgba(85,30,30,.85)'; g.beginPath(); g.ellipse(0, 20, 8, 6, 0, 0, TAU); g.fill();
    } else if (expr === 'hurt') {
      g.fillStyle = 'rgba(85,30,30,.8)'; g.beginPath(); g.ellipse(0, 20, 7, 5, 0, 0, TAU); g.fill();
    } else if (expr === 'win' || expr === 'smile' || ch.id === 'prabowo') {
      g.beginPath(); g.arc(0, 15, 8, .25, Math.PI - .25); g.stroke();
    } else {
      g.beginPath(); g.moveTo(-6, 20); g.quadraticCurveTo(0, 23, 6, 20); g.stroke();
    }
  }
  // glasses
  if (ch.glasses) {
    g.strokeStyle = 'rgba(28,22,18,.86)'; g.lineWidth = 2;
    rr(g, -18, -9, 14, 12, 4); g.stroke();
    rr(g, 4, -9, 14, 12, 4); g.stroke();
    g.beginPath(); g.moveTo(-4, -4); g.lineTo(4, -4); g.stroke();
    g.beginPath(); g.moveTo(-18, -5); g.lineTo(-23, -3); g.stroke();
    g.beginPath(); g.moveTo(18, -5); g.lineTo(23, -3); g.stroke();
    g.fillStyle = 'rgba(200,235,255,.12)'; rr(g, -18, -9, 14, 12, 4); g.fill(); rr(g, 4, -9, 14, 12, 4); g.fill();
  }
  // bindi
  if (ch.bindi) {
    g.fillStyle = '#c81d3c'; g.beginPath(); g.arc(0, -15, 2.2, 0, TAU); g.fill();
  }
  g.restore();
}

function drawHair(g, ch, t) {
  const h = ch.hair;
  g.fillStyle = h;
  switch (ch.hairStyle) {
    case 'modi': {
      g.beginPath(); g.moveTo(-24, -14);
      g.bezierCurveTo(-26, -35, -12, -42, 10, -40);
      g.bezierCurveTo(25, -38, 26, -26, 23, -13);
      g.quadraticCurveTo(12, -25, -3, -26);
      g.quadraticCurveTo(-16, -26, -24, -14); g.fill();
      // side part
      g.strokeStyle = 'rgba(120,120,120,.45)'; g.lineWidth = 1.4;
      g.beginPath(); g.moveTo(-8, -38); g.quadraticCurveTo(-4, -26, -6, -16); g.stroke();
      break;
    }
    case 'swoop': {
      g.beginPath(); g.moveTo(-25, -16);
      g.bezierCurveTo(-30, -44, -8, -48, 14, -42);
      g.bezierCurveTo(30, -38, 25, -24, 22, -18);
      g.bezierCurveTo(14, -31, -4, -32, -14, -22);
      g.bezierCurveTo(-20, -16, -24, -8, -25, -16); g.fill();
      g.strokeStyle = 'rgba(255,240,170,.5)'; g.lineWidth = 2;
      g.beginPath(); g.moveTo(-18, -34); g.quadraticCurveTo(4, -44, 20, -35); g.stroke();
      break;
    }
    case 'messy': {
      g.beginPath(); g.moveTo(-26, -12);
      g.bezierCurveTo(-30, -40, -10, -46, 4, -42);
      g.lineTo(2, -52); g.lineTo(10, -41);
      g.lineTo(18, -49); g.lineTo(18, -38);
      g.lineTo(28, -42); g.lineTo(24, -22); g.lineTo(20, -12);
      g.quadraticCurveTo(0, -30, -26, -12); g.fill();
      break;
    }
    case 'bob': {
      g.beginPath(); g.moveTo(-27, -12);
      g.bezierCurveTo(-30, -40, -8, -46, 12, -42);
      g.bezierCurveTo(30, -38, 29, -18, 24, -6);
      g.lineTo(22, 18); g.lineTo(15, 8); g.lineTo(12, -2);
      g.quadraticCurveTo(4, -10, -10, -6);
      g.lineTo(-15, 20); g.lineTo(-22, 8); g.lineTo(-24, -4);
      g.closePath(); g.fill();
      break;
    }
    case 'short':
    default: {
      g.beginPath(); g.moveTo(-24, -12);
      g.bezierCurveTo(-26, -38, -6, -44, 14, -40);
      g.bezierCurveTo(26, -37, 26, -24, 23, -12);
      g.quadraticCurveTo(12, -27, -4, -26);
      g.quadraticCurveTo(-16, -26, -24, -12); g.fill();
      if (ch.hairStyle === 'short') {
        g.strokeStyle = 'rgba(255,255,255,.16)'; g.lineWidth = 1.3;
        g.beginPath(); g.moveTo(-14, -34); g.quadraticCurveTo(2, -40, 17, -32); g.stroke();
      }
      break;
    }
  }
}

function drawTorso(g, ch, p, f) {
  const shY = p.shoulder.y, hipY = p.hip.y, lean = p.lean;
  const shX = lean, hipX = lean * .45;
  const shW = 32 * ch.build, hipW = 23.5 * ch.build;
  // torso shadow / outline
  g.fillStyle = ch.suit;
  g.beginPath();
  g.moveTo(shX - shW, shY);
  g.quadraticCurveTo(shX - shW + 4, shY + 38, hipX - hipW, hipY);
  g.lineTo(hipX + hipW, hipY);
  g.quadraticCurveTo(shX + shW - 4, shY + 38, shX + shW, shY);
  g.quadraticCurveTo(shX, shY + 10, shX - shW, shY);
  g.closePath(); g.fill();
  // jacket shading
  g.fillStyle = ch.suit2; g.globalAlpha = .55;
  g.beginPath(); g.moveTo(shX - shW, shY); g.lineTo(shX - shW + 9, shY + 6); g.lineTo(hipX - hipW + 5, hipY); g.lineTo(hipX - hipW, hipY); g.closePath(); g.fill();
  g.globalAlpha = 1;
  if (ch.belly) {
    g.fillStyle = ch.suit;
    g.beginPath(); g.ellipse(hipX, hipY - 38, 29 * ch.build, 32 * ch.build, 0, 0, TAU); g.fill();
    g.fillStyle = 'rgba(255,255,255,.05)'; g.beginPath(); g.ellipse(hipX - 8, hipY - 48, 18, 20, 0, 0, TAU); g.fill();
  }
  if (ch.saree) {
    // saree drape
    g.fillStyle = ch.c1;
    g.beginPath(); g.moveTo(shX - 20, shY + 2); g.lineTo(shX + 22, shY + 8); g.lineTo(hipX + 10, hipY + 2); g.lineTo(hipX - 18, hipY - 4); g.closePath(); g.fill();
    g.strokeStyle = ch.c2; g.lineWidth = 5;
    g.beginPath(); g.moveTo(shX - 21, shY + 4); g.quadraticCurveTo(shX + 2, shY + 58, hipX + 12, hipY + 1); g.stroke();
    g.fillStyle = 'rgba(255,255,255,.12)';
    g.beginPath(); g.moveTo(shX + 4, shY + 4); g.lineTo(shX + 24, shY + 10); g.lineTo(hipX + 12, hipY); g.closePath(); g.fill();
  } else if (ch.bareArms) {
    // tee: no lapels, crew neck
    g.fillStyle = 'rgba(255,255,255,.16)';
    g.beginPath(); g.arc(shX, shY + 2, 12, .1, Math.PI - .1); g.fill();
  } else {
    // shirt
    g.fillStyle = ch.shirt;
    g.beginPath();
    g.moveTo(shX - 9, shY + 1);
    g.lineTo(shX + 9, shY + 1);
    g.lineTo(hipX + 8, hipY - 2);
    g.lineTo(hipX - 8, hipY - 2);
    g.closePath(); g.fill();
    // lapels
    g.fillStyle = ch.suit2;
    g.beginPath(); g.moveTo(shX - 15, shY); g.lineTo(shX - 3, shY + 30); g.lineTo(shX - 11, shY + 50); g.lineTo(shX - 24, shY + 8); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(shX + 15, shY); g.lineTo(shX + 3, shY + 30); g.lineTo(shX + 11, shY + 50); g.lineTo(shX + 24, shY + 8); g.closePath(); g.fill();
    // tie
    if (ch.tie) {
      const tieLen = ch.id === 'trump' ? 74 : 54;
      const tw = ch.id === 'trump' ? 4.5 : 3.2;
      g.fillStyle = ch.tie;
      g.beginPath();
      g.moveTo(shX - tw, shY + 6); g.lineTo(shX + tw, shY + 6);
      g.lineTo(shX + tw + 1.5, shY + 22); g.lineTo(shX + 1, shY + 13 + tieLen);
      g.lineTo(shX - tw - 1.5, shY + 22); g.closePath(); g.fill();
      g.fillStyle = 'rgba(255,255,255,.2)';
      g.beginPath(); g.moveTo(shX - 1, shY + 10); g.lineTo(shX + 1.5, shY + 16); g.lineTo(shX, shY + 8 + tieLen); g.closePath(); g.fill();
      g.fillStyle = 'rgba(0,0,0,.16)';
      g.beginPath(); g.moveTo(shX + tw, shY + 8); g.lineTo(shX + tw + 1.5, shY + 22); g.lineTo(shX + 1, shY + 13 + tieLen); g.closePath(); g.fill();
    }
  }
  // Modi vest
  if (ch.id === 'modi') {
    g.fillStyle = '#e8b45e'; g.globalAlpha = .9;
    g.beginPath(); g.moveTo(shX - 25, shY + 2); g.lineTo(shX - 8, shY + 18); g.lineTo(shX - 10, hipY); g.lineTo(shX - 22, hipY); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(shX + 25, shY + 2); g.lineTo(shX + 8, shY + 18); g.lineTo(shX + 10, hipY); g.lineTo(shX + 22, hipY); g.closePath(); g.fill();
    g.globalAlpha = 1;
  }
  // belt
  g.fillStyle = 'rgba(25,20,18,.7)'; g.fillRect(hipX - hipW + 2, hipY - 5, hipW * 2 - 4, 6);
  // jacket buttons + seams
  if (!ch.saree && !ch.bareArms) {
    g.fillStyle = 'rgba(0,0,0,.3)';
    for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(shX + 1, shY + 38 + i * 14, 1.7, 0, TAU); g.fill(); }
    g.strokeStyle = 'rgba(255,255,255,.09)'; g.lineWidth = 1.5;
    g.beginPath(); g.moveTo(shX + 19, shY + 9); g.lineTo(shX + 13, hipY - 2); g.stroke();
    // pocket square
    g.fillStyle = ch.c1; g.beginPath(); g.moveTo(shX - 24, shY + 34); g.lineTo(shX - 15, shY + 30); g.lineTo(shX - 17, shY + 42); g.closePath(); g.fill();
  }
  // flag patch
  drawFlagBadge(g, shX + 12, shY + 14, 12, 8, ch.c1, ch.c2, false);
  // lapel pin
  g.fillStyle = ch.c1; g.beginPath(); g.arc(shX + 15, shY + 31, 2.6, 0, TAU); g.fill();
}

function drawArm(g, ch, a, front, f) {
  const col = ch.bareArms ? ch.skin : ch.suit;
  g.lineCap = 'round'; g.lineJoin = 'round';
  g.strokeStyle = 'rgba(18,12,12,.55)'; g.lineWidth = front ? 16 : 14;
  g.beginPath(); g.moveTo(a.s.x, a.s.y); g.lineTo(a.e.x, a.e.y); g.lineTo(a.h.x, a.h.y); g.stroke();
  g.strokeStyle = col; g.lineWidth = front ? 12.5 : 10.5;
  g.beginPath(); g.moveTo(a.s.x, a.s.y); g.lineTo(a.e.x, a.e.y); g.lineTo(a.h.x, a.h.y); g.stroke();
  // cuff
  if (!ch.bareArms) {
    g.strokeStyle = ch.shirt; g.lineWidth = 2.5;
    const dx = a.h.x - a.e.x, dy = a.h.y - a.e.y, d = Math.hypot(dx, dy) || 1;
    g.beginPath(); g.moveTo(a.h.x - dx / d * 10, a.h.y - dy / d * 10); g.lineTo(a.h.x - dx / d * 3, a.h.y - dy / d * 3); g.stroke();
  }
  // hand
  g.fillStyle = ch.skin;
  g.beginPath(); g.arc(a.h.x, a.h.y, front ? 7.2 : 6.4, 0, TAU); g.fill();
  g.strokeStyle = 'rgba(40,18,12,.35)'; g.lineWidth = 1;
  g.beginPath(); g.arc(a.h.x, a.h.y, front ? 7.2 : 6.4, 0, TAU); g.stroke();
}

function drawLeg(g, ch, l, front) {
  g.lineCap = 'round'; g.lineJoin = 'round';
  g.strokeStyle = 'rgba(15,10,10,.55)'; g.lineWidth = front ? 22 : 20;
  g.beginPath(); g.moveTo(l.s.x, l.s.y); g.lineTo(l.k.x, l.k.y); g.lineTo(l.f.x, l.f.y); g.stroke();
  g.strokeStyle = ch.saree ? ch.suit2 : ch.pants; g.lineWidth = front ? 17 : 15;
  g.beginPath(); g.moveTo(l.s.x, l.s.y); g.lineTo(l.k.x, l.k.y); g.lineTo(l.f.x, l.f.y); g.stroke();
  // shoe
  const ang = Math.atan2(l.f.y - l.k.y, l.f.x - l.k.x);
  g.save(); g.translate(l.f.x, l.f.y); g.rotate(clamp(ang, -0.8, 0.55));
  g.fillStyle = '#16141a';
  rr(g, -8, -6, front ? 30 : 27, 12, 5); g.fill();
  g.fillStyle = 'rgba(255,255,255,.12)'; rr(g, -3, -4, 16, 3, 2); g.fill();
  g.restore();
}

function basePose() {
  return {
    lean: 0, bob: 0,
    head: { x: 0, y: -203 },
    shoulder: { x: 0, y: -170 },
    hip: { x: 0, y: -91 },
    armF: { s: { x: 16, y: -167 }, e: { x: 30, y: -145 }, h: { x: 27, y: -121 } },
    armB: { s: { x: -16, y: -167 }, e: { x: -30, y: -145 }, h: { x: -18, y: -121 } },
    legF: { s: { x: 12, y: -91 }, k: { x: 25, y: -48 }, f: { x: 30, y: 0 } },
    legB: { s: { x: -12, y: -91 }, k: { x: -24, y: -48 }, f: { x: -31, y: 0 } },
    crouch: 0
  };
}

function poseFor(f, t) {
  const p = basePose();
  const st = f.state;
  const bob = Math.sin(t * 2.6 + f.index * 2) * 2.1;
  const walk = f.walkPhase || 0;
  const a = f.attack;
  if (st === 'idle') {
    p.hip.y += bob; p.shoulder.y += bob; p.head.y += bob;
    p.armF.h.y += bob * .7; p.armB.h.y += bob * .7;
    p.armF.e = { x: 31, y: -147 + bob }; p.armF.h = { x: 26, y: -124 + bob };
    p.armB.e = { x: -26, y: -146 + bob }; p.armB.h = { x: -16, y: -121 + bob };
  } else if (st === 'walk') {
    const s = Math.sin(walk * 8);
    p.legF.f = { x: 30 + s * 11, y: 0 }; p.legF.k = { x: 25 + s * 5, y: -48 };
    p.legB.f = { x: -31 - s * 11, y: 0 }; p.legB.k = { x: -24 - s * 5, y: -48 };
    p.hip.y += Math.abs(s) * 2; p.shoulder.y += Math.abs(s) * 2; p.head.y += Math.abs(s) * 2;
    p.armF.e = { x: 31, y: -146 }; p.armF.h = { x: 27, y: -122 - s * 3 };
    p.armB.e = { x: -28, y: -146 }; p.armB.h = { x: -20, y: -120 + s * 3 };
    p.lean = 1.5;
  } else if (st === 'jump') {
    p.legF.f = { x: 27, y: -24 }; p.legF.k = { x: 33, y: -62 };
    p.legB.f = { x: -19, y: -40 }; p.legB.k = { x: -32, y: -74 };
    p.hip.y = -99; p.shoulder.y = -177; p.head.y = -210;
    p.armF.e = { x: 38, y: -175 }; p.armF.h = { x: 44, y: -198 };
    p.armB.e = { x: -34, y: -172 }; p.armB.h = { x: -42, y: -192 };
    p.lean = 2;
  } else if (st === 'block') {
    p.hip.y = -84; p.shoulder.y = -163; p.head.y = -195;
    p.legF.f = { x: 31, y: 0 }; p.legF.k = { x: 28, y: -43 };
    p.legB.f = { x: -33, y: 0 }; p.legB.k = { x: -27, y: -43 };
    p.armF.e = { x: 30, y: -178 }; p.armF.h = { x: 4, y: -194 };
    p.armB.e = { x: 8, y: -178 }; p.armB.h = { x: 22, y: -169 };
    p.lean = -3;
  } else if (st === 'hurt') {
    const k = clamp(f.hitstun / 18, 0, 1);
    p.lean = -9 * k; p.head.x = -8 * k; p.head.y = -196;
    p.armF.e = { x: 29, y: -160 }; p.armF.h = { x: 40, y: -176 };
    p.armB.e = { x: -34, y: -154 }; p.armB.h = { x: -44, y: -134 };
    p.legF.f = { x: 38, y: 0 }; p.legB.f = { x: -38, y: 0 };
    p.hip.y = -88;
  } else if (st === 'stun') {
    const s = Math.sin(t * 9);
    p.lean = s * 4; p.head.x = s * 5; p.head.y = -200 + Math.cos(t * 7) * 2;
    p.armF.e = { x: 33, y: -145 + s * 4 }; p.armF.h = { x: 23, y: -116 + s * 6 };
    p.armB.e = { x: -33, y: -145 - s * 4 }; p.armB.h = { x: -23, y: -116 - s * 6 };
    p.legF.f = { x: 36, y: 0 }; p.legB.f = { x: -36, y: 0 };
  } else if (st === 'win') {
    const b = Math.abs(Math.sin(t * 4)) * 8;
    p.hip.y = -91 - b; p.shoulder.y = -170 - b; p.head.y = -203 - b;
    p.armF.e = { x: 34, y: -188 - b }; p.armF.h = { x: 38, y: -220 - b };
    p.armB.e = { x: -34, y: -188 - b }; p.armB.h = { x: -30, y: -222 - b };
    p.legF.f = { x: 38, y: 0 }; p.legB.f = { x: -36, y: 0 };
    p.lean = -1;
  } else if (st === 'attack' && a) {
    const t0 = f.attackT;
    if (a.kind === 'light') {
      const total = a.startup + a.active + a.recovery;
      const k = t0 < a.startup ? t0 / a.startup : t0 < a.startup + a.active ? 1 : clamp(1 - (t0 - a.startup - a.active) / a.recovery, 0, 1);
      const wind = t0 < a.startup ? 1 - k : 0;
      p.lean = 4 * k;
      p.armF.s = { x: 16 + p.lean, y: -167 };
      p.armF.e = { x: 18 + 34 * k - wind * 16, y: -160 - k * 3 };
      p.armF.h = { x: 12 + 70 * k - wind * 15, y: -158 + wind * 8 };
      p.armB.e = { x: -28 - k * 8, y: -148 }; p.armB.h = { x: -12 - k * 8, y: -150 };
      p.legF.f = { x: 30 + k * 10, y: 0 }; p.legB.f = { x: -31 - k * 4, y: 0 };
      p.hip.y = -91; p.head.x = 4 * k;
    } else if (a.kind === 'heavy') {
      const total = a.startup + a.active + a.recovery;
      const k = t0 < a.startup ? t0 / a.startup : t0 < a.startup + a.active ? 1 : clamp(1 - (t0 - a.startup - a.active) / a.recovery, 0, 1);
      p.lean = -7 * k;
      p.legF.s = { x: 12, y: -91 };
      p.legF.k = { x: 26 + 30 * k, y: -90 - 8 * k };
      p.legF.f = { x: 30 + 70 * k, y: -8 - 88 * k };
      p.legB.f = { x: -34, y: 0 }; p.legB.k = { x: -28, y: -46 };
      p.armF.e = { x: 30 - k * 12, y: -150 }; p.armF.h = { x: 22 - k * 16, y: -132 };
      p.armB.e = { x: -32 - k * 6, y: -160 }; p.armB.h = { x: -38 - k * 8, y: -180 };
      p.hip.y = -94; p.shoulder.y = -172;
    } else if (a.kind === 'special' || a.kind === 'super') {
      const k = clamp(t0 / Math.max(1, a.windup || 16), 0, 1);
      const kind = a.charKind || 'cast';
      if (a.kind === 'super') {
        p.lean = -4; p.head.y = -209;
        p.armF.e = { x: 32, y: -195 }; p.armF.h = { x: 30, y: -232 };
        p.armB.e = { x: -32, y: -195 }; p.armB.h = { x: -28, y: -234 };
        p.legF.f = { x: 36, y: 0 }; p.legB.f = { x: -37, y: 0 };
        p.hip.y = -94;
      } else if (kind === 'rush') {
        p.lean = 10 * k; p.head.x = 6 * k; p.hip.y = -86;
        p.armF.e = { x: 12, y: -164 }; p.armF.h = { x: -14, y: -150 };
        p.armB.e = { x: -26, y: -158 }; p.armB.h = { x: -44, y: -148 };
        p.legF.f = { x: 44 + k * 14, y: 0 }; p.legF.k = { x: 38, y: -44 };
        p.legB.f = { x: -44, y: 0 }; p.legB.k = { x: -32, y: -46 };
      } else if (kind === 'aura') {
        p.lean = -3; p.head.y = -205;
        p.armF.e = { x: 38, y: -172 - k * 8 }; p.armF.h = { x: 48, y: -191 - k * 12 };
        p.armB.e = { x: -38, y: -172 - k * 8 }; p.armB.h = { x: -48, y: -191 - k * 12 };
        p.legF.f = { x: 36, y: 0 }; p.legB.f = { x: -36, y: 0 };
      } else {
        p.lean = 5 * k; p.head.x = 3 * k;
        p.armF.e = { x: 30 + 22 * k, y: -168 }; p.armF.h = { x: 22 + 60 * k, y: -158 };
        p.armB.e = { x: -28, y: -155 }; p.armB.h = { x: -6 + 12 * k, y: -146 };
        p.legF.f = { x: 34 + k * 8, y: 0 }; p.legB.f = { x: -34, y: 0 };
        p.hip.y = -89;
      }
    }
  } else if (st === 'ko') {
    p.hip.y = -80; p.shoulder.y = -154; p.head.y = -186;
  }
  // apply bob
  if (st !== 'ko') {
    p.head.x += p.lean * .6;
    p.head.y += p.bob;
  }
  return p;
}

function drawFighter(g, f, t, opts = {}) {
  const ch = f.char;
  const p = poseFor(f, t);
  const alpha = opts.alpha ?? 1;
  const air = clamp((FLOOR - f.y) / 210, 0, 1);
  // shadow
  g.save();
  g.globalAlpha = alpha * (0.37 - air * .14);
  g.fillStyle = '#050508';
  g.beginPath(); g.ellipse(f.x, FLOOR + 9, 48 * (1 - air * .28), 11 * (1 - air * .22), 0, 0, TAU); g.fill();
  g.restore();

  g.save();
  g.globalAlpha = alpha;
  g.translate(f.x, f.y + (f.state === 'ko' ? 0 : 0));
  g.scale(f.facing, 1);
  if (f.state === 'ko') {
    const k = clamp((f.koT || 0) / 34, 0, 1);
    g.translate(-8 * k, -16 * k);
    g.rotate(-1.42 * k);
  }
  // aura
  if (f.aura > 0) {
    const a = clamp(f.aura / 20, 0, 1);
    const rad = 105 + Math.sin(t * 12) * 8;
    const gr = g.createRadialGradient(0, -110, 10, 0, -110, rad);
    gr.addColorStop(0, ch.glow + 'aa'); gr.addColorStop(.55, ch.glow + '33'); gr.addColorStop(1, ch.glow + '00');
    g.fillStyle = gr; g.beginPath(); g.arc(0, -110, rad, 0, TAU); g.fill();
    g.strokeStyle = ch.glow; g.globalAlpha = alpha * .5 * a;
    for (let i = 0; i < 5; i++) {
      const ang = t * 5 + i * TAU / 5, r1 = 38 + (i % 3) * 14, r2 = 95 + Math.sin(t * 7 + i) * 16;
      g.lineWidth = 3;
      g.beginPath(); g.moveTo(Math.cos(ang) * r1, -112 + Math.sin(ang) * r1); g.lineTo(Math.cos(ang) * r2, -112 + Math.sin(ang) * r2); g.stroke();
    }
    g.globalAlpha = alpha;
  }
  if (f.flash > 0) g.filter = 'brightness(2.1) saturate(.45)';
  // limbs back
  drawArm(g, ch, p.armB, false, f);
  drawLeg(g, ch, p.legB, false);
  drawLeg(g, ch, p.legF, true);
  // torso
  drawTorso(g, ch, p, f);
  // neck
  g.fillStyle = ch.skin;
  g.beginPath(); g.rect(-8 + p.lean * .5, p.shoulder.y - 13, 16, 24); g.fill();
  if (ch.saree) { g.fillStyle = ch.c2; g.fillRect(-10 + p.lean * .5, p.shoulder.y - 12, 20, 6); }
  // head
  const expr = f.state === 'ko' ? 'ko' : f.state === 'hurt' ? 'hurt' : f.state === 'win' ? 'win' : (f.state === 'attack' ? ((f.attack?.kind === 'super') ? 'super' : 'angry') : (f.state === 'stun' ? 'hurt' : 'idle'));
  drawHead(g, ch, p.head.x, p.head.y, 1.04 + (ch.build - 1) * .3, t, expr);
  // front arm
  drawArm(g, ch, p.armF, true, f);
  // accessory: Trump hair already, Boris flag? 
  g.restore();
  if (f.flash > 0) g.filter = 'none';

  // stun stars
  if (f.state === 'stun') {
    g.save(); g.translate(f.x, f.y - 238); g.fillStyle = '#ffe75c';
    for (let i = 0; i < 3; i++) {
      const ang = t * 3 + i * TAU / 3;
      starPath(g, Math.cos(ang) * 24, Math.sin(ang) * 8, 6, 2.5, 5, t * 4); g.fill();
    }
    g.restore();
  }
  // player arrow
  if (opts.marker) {
    g.save(); g.translate(f.x, f.y - 248 + Math.sin(t * 4) * 3);
    g.fillStyle = opts.marker;
    g.beginPath(); g.moveTo(-8, -10); g.lineTo(8, -10); g.lineTo(0, 0); g.closePath(); g.fill();
    g.fillStyle = 'rgba(0,0,0,.55)'; g.font = '700 9px "Courier New", monospace'; g.textAlign = 'center'; g.fillText(opts.label || '', 0, -12);
    g.restore();
  }
}

/* ============================ PORTRAITS ============================ */
function paintPortrait(cv, ch, t, variant = 'card') {
  const g = cv.getContext('2d');
  const w = cv.width, h = cv.height;
  g.clearRect(0, 0, w, h);
  const accent = ch.c1, accent2 = ch.c2;
  let bg = g.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#161620'); bg.addColorStop(.55, '#0c0c12'); bg.addColorStop(1, '#08080d');
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  // bold accent shapes
  g.save();
  g.globalAlpha = .8;
  g.fillStyle = accent; g.beginPath(); g.moveTo(0, h * .18); g.lineTo(w * .55, 0); g.lineTo(w * .78, 0); g.lineTo(w * .22, h * .28); g.closePath(); g.fill();
  g.globalAlpha = .22; g.fillStyle = accent2;
  g.beginPath(); g.moveTo(w, h * .1); g.lineTo(w * .4, h); g.lineTo(w * .72, h); g.lineTo(w, h * .36); g.closePath(); g.fill();
  g.restore();
  // halftone
  halftone(g, 0, 0, w, h, Math.max(6, w / 22), 'rgba(255,255,255,.045)', Math.max(1, w / 160));
  // big circle
  g.strokeStyle = 'rgba(255,255,255,.14)'; g.lineWidth = Math.max(1, w / 120);
  g.beginPath(); g.arc(w * .5, h * .42, w * .32, 0, TAU); g.stroke();
  g.strokeStyle = accent; g.globalAlpha = .3;
  g.beginPath(); g.arc(w * .5, h * .42, w * .38, 0, TAU); g.stroke(); g.globalAlpha = 1;
  // diagonal stripes
  g.save(); g.globalAlpha = .08; g.strokeStyle = '#fff'; g.lineWidth = Math.max(1, w / 90);
  for (let i = -h; i < w + h; i += Math.max(14, w / 9)) {
    g.beginPath(); g.moveTo(i, 0); g.lineTo(i + h, h); g.stroke();
  }
  g.restore();

  // bust
  const sc = Math.min(w / 300, h / 300) * (variant === 'large' ? 1.05 : 1);
  g.save();
  g.translate(w * .5, h * .52 + Math.sin(t * 1.8 + ch.name.length) * (h * .008));
  g.scale(sc, sc);
  // shoulders
  g.fillStyle = ch.suit;
  g.beginPath();
  g.moveTo(-105, 118); g.quadraticCurveTo(-76, 74, -28, 68); g.lineTo(28, 68);
  g.quadraticCurveTo(76, 74, 105, 118); g.lineTo(105, 150); g.lineTo(-105, 150); g.closePath(); g.fill();
  // shirt
  g.fillStyle = ch.shirt;
  g.beginPath(); g.moveTo(-24, 68); g.lineTo(24, 68); g.lineTo(18, 150); g.lineTo(-18, 150); g.closePath(); g.fill();
  // lapels
  g.fillStyle = ch.suit2;
  g.beginPath(); g.moveTo(-44, 72); g.lineTo(-10, 148); g.lineTo(-30, 150); g.lineTo(-70, 82); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(44, 72); g.lineTo(10, 148); g.lineTo(30, 150); g.lineTo(70, 82); g.closePath(); g.fill();
  // tie
  if (ch.tie) {
    g.fillStyle = ch.tie;
    g.beginPath(); g.moveTo(0, 74); g.lineTo(13, 88); g.lineTo(6, 150); g.lineTo(-8, 150); g.lineTo(-13, 88); g.closePath(); g.fill();
    g.fillStyle = 'rgba(255,255,255,.15)'; g.beginPath(); g.moveTo(-1, 84); g.lineTo(3, 90); g.lineTo(0, 148); g.closePath(); g.fill();
  }
  if (ch.saree) {
    g.fillStyle = ch.c1; g.beginPath(); g.moveTo(-60, 76); g.lineTo(18, 72); g.lineTo(44, 150); g.lineTo(-8, 150); g.closePath(); g.fill();
    g.strokeStyle = ch.c2; g.lineWidth = 10; g.beginPath(); g.moveTo(-62, 78); g.quadraticCurveTo(-24, 116, 42, 150); g.stroke();
  }
  if (ch.belly) {
    g.fillStyle = ch.suit; g.beginPath(); g.ellipse(0, 112, 38, 34, 0, 0, TAU); g.fill();
  }
  // flag stripe
  g.fillStyle = ch.c1; g.fillRect(-105, 128, 210, 5);
  g.fillStyle = ch.c2; g.fillRect(-105, 133, 210, 3);
  // neck
  g.fillStyle = ch.skin; g.fillRect(-14, 40, 28, 32);
  // head
  drawHead(g, ch, 0, -8, 2.25, t, variant === 'large' ? 'smile' : 'idle');
  // mic / accessory for some
  if (ch.id === 'modi') {
    g.strokeStyle = '#2a2a2e'; g.lineWidth = 5; g.lineCap = 'round';
    g.beginPath(); g.moveTo(76, 118); g.lineTo(54, 48); g.stroke();
    g.fillStyle = '#222'; g.beginPath(); g.arc(52, 42, 9, 0, TAU); g.fill();
    g.strokeStyle = ch.c1; g.lineWidth = 2.5; g.beginPath(); g.arc(52, 42, 9, 0, TAU); g.stroke();
  }
  g.restore();
  // accent bar bottom
  g.fillStyle = accent; g.fillRect(0, h - Math.max(3, h * .018), w, Math.max(3, h * .018));
  g.fillStyle = accent2; g.fillRect(0, h - Math.max(6, h * .03), w * .35, Math.max(3, h * .012));
  // year stamp
  g.save(); g.globalAlpha = .18; g.fillStyle = '#fff'; g.font = `italic 900 ${Math.max(12, w * .16)}px Clash, Impact, sans-serif`; g.textAlign = 'right';
  g.fillText('6', w - w * .04, h * .2); g.restore();
}

/* ============================ GAME STATE ============================ */
const G = {
  screen: 'title', mode: 'cpu', paused: false,
  sel: { p1: null, p2: null, active: 0 },
  stage: 'desert',
  players: [],
  round: 1, wins: [0, 0], timer: 60,
  roundState: 'idle', roundT: 0, concludeT: 0, matchWinner: -1, roundReason: '',
  particles: [], projectiles: [], hazards: [], rings: [], slashes: [], floaters: [],
  hitstop: 0, slowT: 0, shake: 0, shakeX: 0, shakeY: 0, zoom: 0,
  flash: 0, flashColor: '255,255,255',
  superFlash: 0, superColor: '#e9ff35',
  blackout: 0,
  annT: 0, annMain: '', annSub: '',
  time: 0, last: 0,
  attract: null, attractStage: 'india', attractT: 0, menuPulse: 0,
  pending: null, vsT: 0,
  aiLevel: 1,
  stats: { hits: 0, specials: 0, supers: 0 }
};

/* ============================ FIGHTER ============================ */
function makeFighter(charId, index, x, isAI = false) {
  const ch = CHAR_BY_ID[charId] || CHARS[0];
  return {
    char: ch, index, x, y: FLOOR, vx: 0, vy: 0, facing: index === 0 ? 1 : -1,
    hp: 1000, maxHp: 1000, meter: 30, wins: 0,
    state: 'idle', stateT: 0, grounded: true, walkPhase: 0,
    attack: null, attackT: 0, hitstun: 0, blockstun: 0, stun: 0,
    invuln: 0, flash: 0, aura: 0, cooldown: 0, koT: 0,
    combo: 0, comboT: 0, isAI,
    ai: { timer: 0, move: 0, blockTimer: 0, plan: 0 },
    trail: [], lastHitBy: -1
  };
}

const MOVES = {
  light: { kind: 'light', startup: 4, active: 3, recovery: 8, damage: 40, range: 88, hitY: -196, hitH: 84, hitstun: 14, kb: 3.2, meter: 5, hitstop: 4 },
  heavy: { kind: 'heavy', startup: 9, active: 5, recovery: 15, damage: 74, range: 114, hitY: -206, hitH: 104, hitstun: 21, kb: 7.2, meter: 8, hitstop: 6 }
};

const SPECIAL_INFO = {
  modi: { total: 38, fireAt: 14, dash: 0 },
  xi: { total: 48, fireAt: 17, dash: 0 },
  putin: { total: 36, fireAt: 0, dash: 1, dashFrom: 7, dashTo: 25, dashSpeed: 15, damage: 86, hitstun: 24, kb: 10 },
  zelensky: { total: 38, fireAt: 12, dash: 0 },
  trump: { total: 38, fireAt: 13, dash: 0 },
  ramaphosa: { total: 42, fireAt: 15, dash: 0 },
  boris: { total: 42, fireAt: 0, dash: 1, dashFrom: 7, dashTo: 28, dashSpeed: 17, damage: 80, hitstun: 22, kb: 9 },
  macron: { total: 36, fireAt: 12, dash: 0 },
  shehbaz: { total: 36, fireAt: 0, dash: 1, dashFrom: 6, dashTo: 24, dashSpeed: 20, damage: 78, hitstun: 20, kb: 8 },
  hasina: { total: 40, fireAt: 14, dash: 0 },
  prabowo: { total: 40, fireAt: 14, dash: 0 }
};

function faultsInit() {
  // build background canvases and particle pools
  for (const s of STAGES) stageBases[s.id] = buildStageBase(s.id);
  initCrowdAndWeather();
}

/* ============================ EFFECTS ============================ */
function burst(x, y, n, color, opts = {}) {
  const { speed = 7, life = 24, size = 4, gravity = .25, type = 'spark', spread = TAU, dir = 0 } = opts;
  for (let i = 0; i < n; i++) {
    const a = dir + rand(-spread / 2, spread / 2);
    const sp = rand(speed * .25, speed);
    G.particles.push({
      x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: rand(life * .6, life), maxLife: life,
      size: rand(size * .5, size), color: Array.isArray(color) ? choose(color) : color,
      gravity, type, rot: rand(0, TAU), vr: rand(-.2, .2)
    });
  }
}
function dust(x, y, n = 8, dir = 0) {
  for (let i = 0; i < n; i++) {
    G.particles.push({
      x: x + rand(-14, 14), y: y + rand(-2, 4), vx: rand(-1.2, 1.2) + dir * .4, vy: rand(-1.4, -.2),
      life: rand(16, 30), maxLife: 30, size: rand(2, 6), color: 'rgba(215,190,150,.5)', gravity: -.015, type: 'dust', rot: 0, vr: 0
    });
  }
}
function ring(x, y, color, maxR = 100, life = 20, width = 4) {
  G.rings.push({ x, y, r: 12, maxR, life, maxLife: life, color, width });
}
function slashEffect(x, y, ang, color, len = 130, life = 14) {
  G.slashes.push({ x, y, ang, color, len, life, maxLife: life });
}
function floatText(x, y, text, color = '#e9ff35', size = 30) {
  G.floaters.push({ x, y, text, color, size, life: 52, maxLife: 52, vy: -1.5 });
}

function updateParticles(dtf) {
  for (let i = G.particles.length - 1; i >= 0; i--) {
    const p = G.particles[i];
    p.life -= dtf;
    if (p.life <= 0) { G.particles.splice(i, 1); continue; }
    p.x += p.vx * dtf; p.y += p.vy * dtf; p.vy += (p.gravity || 0) * dtf;
    p.rot += (p.vr || 0) * dtf;
    if (p.type === 'confetti' || p.type === 'bill') p.vx += Math.sin(p.life * .2) * .02 * dtf;
  }
  for (let i = G.rings.length - 1; i >= 0; i--) {
    const r = G.rings[i]; r.life -= dtf; r.r = lerp(r.r, r.maxR, .12 * dtf);
    if (r.life <= 0) G.rings.splice(i, 1);
  }
  for (let i = G.slashes.length - 1; i >= 0; i--) {
    const s = G.slashes[i]; s.life -= dtf;
    if (s.life <= 0) G.slashes.splice(i, 1);
  }
  for (let i = G.floaters.length - 1; i >= 0; i--) {
    const f = G.floaters[i]; f.life -= dtf; f.y += f.vy * dtf; f.vy *= .97;
    if (f.life <= 0) G.floaters.splice(i, 1);
  }
}

function drawParticles(g) {
  g.save();
  for (const p of G.particles) {
    const a = clamp(p.life / p.maxLife, 0, 1);
    g.globalAlpha = a;
    g.fillStyle = p.color;
    if (p.type === 'spark') {
      g.save(); g.translate(p.x, p.y); g.rotate(Math.atan2(p.vy, p.vx));
      g.fillRect(0, -p.size * .22, p.size * 2.4, p.size * .44); g.restore();
    } else if (p.type === 'star') {
      g.save(); g.translate(p.x, p.y); g.rotate(p.rot);
      starPath(g, 0, 0, p.size * 2, p.size * .75, 5); g.fill(); g.restore();
    } else if (p.type === 'confetti') {
      g.save(); g.translate(p.x, p.y); g.rotate(p.rot); g.fillRect(-p.size, -p.size * .35, p.size * 2, p.size * .7); g.restore();
    } else if (p.type === 'bill') {
      g.save(); g.translate(p.x, p.y); g.rotate(p.rot);
      g.fillStyle = '#6fbf73'; g.fillRect(-p.size * 1.7, -p.size, p.size * 3.4, p.size * 2);
      g.strokeStyle = 'rgba(0,0,0,.4)'; g.lineWidth = 1; g.strokeRect(-p.size * 1.7, -p.size, p.size * 3.4, p.size * 2);
      g.fillStyle = 'rgba(255,255,255,.5)'; g.fillRect(-p.size * 1.5, -p.size * .6, p.size * .7, p.size * .4); g.restore();
    } else if (p.type === 'heart') {
      g.save(); g.translate(p.x, p.y); g.rotate(p.rot); g.scale(p.size / 10, p.size / 10);
      g.beginPath(); g.moveTo(0, 6); g.bezierCurveTo(-12, -4, -6, -12, 0, -6); g.bezierCurveTo(6, -12, 12, -4, 0, 6); g.fill(); g.restore();
    } else if (p.type === 'ring') {
      g.strokeStyle = p.color; g.lineWidth = 2; g.beginPath(); g.arc(p.x, p.y, p.size * (1.5 - a), 0, TAU); g.stroke();
    } else {
      g.beginPath(); g.arc(p.x, p.y, p.size * (p.type === 'dust' ? 1 + (1 - a) : 1), 0, TAU); g.fill();
    }
  }
  g.globalAlpha = 1;
  // rings
  for (const r of G.rings) {
    const a = clamp(r.life / r.maxLife, 0, 1);
    g.globalAlpha = a * .8; g.strokeStyle = r.color; g.lineWidth = r.width * a + .5;
    g.beginPath(); g.arc(r.x, r.y, r.r, 0, TAU); g.stroke();
  }
  // slashes
  for (const s of G.slashes) {
    const a = clamp(s.life / s.maxLife, 0, 1);
    g.globalAlpha = a; g.strokeStyle = s.color; g.lineWidth = 9 * a + 1;
    g.beginPath();
    const dx = Math.cos(s.ang) * s.len / 2, dy = Math.sin(s.ang) * s.len / 2;
    g.moveTo(s.x - dx, s.y - dy); g.lineTo(s.x + dx, s.y + dy); g.stroke();
    g.strokeStyle = '#fff'; g.lineWidth = 2.5 * a;
    g.beginPath(); g.moveTo(s.x - dx * .8, s.y - dy * .8); g.lineTo(s.x + dx * .8, s.y + dy * .8); g.stroke();
  }
  // floating text
  for (const f of G.floaters) {
    const a = clamp(f.life / f.maxLife, 0, 1);
    g.globalAlpha = Math.min(1, a * 1.8);
    g.font = `italic 900 ${f.size}px Clash, Impact, sans-serif`;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.lineWidth = 5; g.strokeStyle = '#08080d'; g.strokeText(f.text, f.x, f.y);
    g.fillStyle = f.color; g.fillText(f.text, f.x, f.y);
  }
  g.restore();
  g.globalAlpha = 1;
}

/* ============================ PROJECTILES / HAZARDS ============================ */
function spawnProjectile(owner, opts) {
  G.projectiles.push(Object.assign({
    owner: owner.index, x: owner.x + owner.facing * 54, y: FLOOR - 155,
    vx: owner.facing * 9, vy: 0, w: 70, h: 60, damage: 60, hits: 1,
    life: 100, maxLife: 100, color: owner.char.c1, color2: owner.char.c2,
    type: 'wave', rot: 0, spin: 0, hitTimer: 0, interval: 20, pierce: false,
    stun: 0, kb: 6, launch: false, gravity: 0, baseY: 0, wobble: 0, delay: 0
  }, opts));
}
function spawnHazard(owner, opts) {
  G.hazards.push(Object.assign({
    owner: owner.index, x: owner.x, y: FLOOR, delay: 22, t: 0,
    radius: 92, damage: 55, color: owner.char.c1, color2: owner.char.c2,
    type: 'lightning', stun: 0, done: false, life: 30, kb: 5
  }, opts));
}
function shootSpecial(f, a) {
  const ch = f.char, foe = foeOf(f);
  const dir = f.facing;
  audio.special();
  if (ch.id === 'modi') {
    spawnProjectile(f, {
      x: f.x + dir * 58, y: FLOOR - 166, w: 80, h: 92, vx: dir * 10.5,
      damage: 66, type: 'wave', color: '#ffb347', color2: '#e9ff35', stun: 4, kb: 7
    });
    ring(f.x + dir * 40, FLOOR - 160, 'rgba(255,180,70,.8)', 80, 18, 3);
    floatText(f.x + dir * 90, FLOOR - 265, 'MITRON!', '#ffb347', 26);
  } else if (ch.id === 'xi') {
    spawnHazard(f, {
      x: foe.x + rand(-45, 45), delay: 24, radius: 110, damage: 82,
      type: 'lightning', color: '#ffde00', color2: '#de2910', stun: 8, kb: 7
    });
    floatText(foe.x, FLOOR - 280, 'SOCIAL CREDIT -500', '#ffde00', 22);
  } else if (ch.id === 'zelensky') {
    spawnHazard(f, {
      x: foe.x + rand(-55, 55), delay: 26, radius: 96, damage: 78,
      type: 'ammo', color: '#ffd700', color2: '#0057b7', stun: 4, kb: 8
    });
    floatText(f.x + dir * 80, FLOOR - 270, 'AMMO INCOMING', '#ffd700', 20);
  } else if (ch.id === 'trump') {
    spawnProjectile(f, {
      x: f.x + dir * 52, y: FLOOR - 190, w: 64, h: 64, vx: dir * 8.5,
      damage: 68, type: 'covfefe', color: '#ffb347', color2: '#d61f2c',
      wobble: 34, baseY: FLOOR - 190, kb: 7
    });
    floatText(f.x + dir * 80, FLOOR - 270, 'COVFEFE!', '#ffb347', 24);
  } else if (ch.id === 'ramaphosa') {
    G.blackout = Math.max(G.blackout, 1.5);
    spawnProjectile(f, {
      x: f.x + dir * 52, y: FLOOR - 165, w: 84, h: 84, vx: dir * 9.5,
      damage: 34, type: 'blackout', color: '#ffd23f', color2: '#1b6b4a',
      stun: 80, kb: 3
    });
    floatText(f.x + dir * 70, FLOOR - 272, 'LOAD SHEDDING', '#ffd23f', 22);
  } else if (ch.id === 'macron') {
    spawnProjectile(f, {
      x: f.x + dir * 55, y: FLOOR - 175, w: 82, h: 34, vx: dir * 10,
      damage: 62, type: 'baguette', color: '#e6b35c', color2: '#b77a32',
      spin: .32, boomerang: true, life: 120, kb: 7
    });
    floatText(f.x + dir * 80, FLOOR - 268, 'LA BAGUETTE', '#ffd84d', 20);
  } else if (ch.id === 'hasina') {
    // close roar + shockwave
    if (Math.abs(foe.x - f.x) < 240) {
      hitFighter(f, foe, 72, { kb: 13, launch: true, hitstun: 26, stun: 10, color: '#39ffb0', sourceX: f.x + dir * 40, sourceY: FLOOR - 160 });
    }
    ring(f.x + dir * 30, FLOOR - 150, 'rgba(57,255,176,.9)', 210, 24, 7);
    burst(f.x + dir * 40, FLOOR - 150, 22, ['#39ffb0', '#e9ff35', '#fff'], { speed: 10, life: 26, size: 4 });
    floatText(f.x + dir * 40, FLOOR - 272, 'ROAAAR!', '#39ffb0', 30);
  } else if (ch.id === 'prabowo') {
    spawnProjectile(f, {
      x: f.x + dir * 50, y: FLOOR - 150, w: 76, h: 70, vx: dir * 8.2,
      damage: 26, type: 'heart', color: '#ff7edb', color2: '#fff', stun: 75, kb: 3,
      wobble: 16, baseY: FLOOR - 150
    });
    floatText(f.x + dir * 60, FLOOR - 270, 'GEMOY~', '#ff7edb', 26);
  } else if (ch.id === 'putin' || ch.id === 'boris' || ch.id === 'shehbaz') {
    // rush aura
    f.aura = 18;
    slashEffect(f.x + dir * 20, FLOOR - 150, dir > 0 ? -.25 : Math.PI + .25, ch.glow, 160, 12);
  }
}

function shootSuper(f, a) {
  const ch = f.char, foe = foeOf(f);
  const dir = f.facing;
  audio.super();
  G.flash = 10; G.flashColor = ch.id === 'ramaphosa' ? '255,215,60' : '255,255,255';
  G.shake = Math.max(G.shake, 14);
  if (ch.id === 'modi') {
    spawnProjectile(f, {
      x: f.x + dir * 60, y: FLOOR - 215, w: 280, h: 150, vx: dir * 14,
      damage: 30, hits: 7, interval: 7, life: 100, type: 'beam',
      color: '#ffb347', color2: '#1c8a3c', stun: 3, kb: 3, pierce: true
    });
    ring(f.x, FLOOR - 170, 'rgba(255,180,70,.9)', 250, 32, 8);
    floatText(f.x + dir * 140, FLOOR - 360, 'MANN KI BAAT', '#ffb347', 34);
  } else if (ch.id === 'xi') {
    spawnProjectile(f, {
      x: f.x + dir * 60, y: FLOOR - 155, w: 300, h: 170, vx: dir * 17,
      damage: 44, hits: 5, interval: 10, life: 100, type: 'train',
      color: '#de2910', color2: '#ffde00', stun: 5, kb: 8
    });
    for (let i = 0; i < 3; i++) spawnHazard(f, { x: foe.x + rand(-130, 130), delay: 18 + i * 13, radius: 100, damage: 20, type: 'lightning', color: '#ffde00', stun: 5 });
    floatText(f.x + dir * 140, FLOOR - 360, 'BELT & ROAD', '#ffde00', 34);
  } else if (ch.id === 'putin') {
    spawnProjectile(f, {
      x: f.x + dir * 55, y: FLOOR - 155, w: 200, h: 185, vx: dir * 13,
      damage: 48, hits: 4, interval: 12, life: 120, type: 'bear',
      color: '#8d6b52', color2: '#f0ede4', stun: 5, kb: 9
    });
    floatText(f.x + dir * 140, FLOOR - 370, 'SIBERIAN CAVALRY', '#7fd6ff', 30);
  } else if (ch.id === 'zelensky') {
    for (let i = 0; i < 8; i++) {
      spawnHazard(f, {
        x: foe.x + rand(-190, 190), delay: 16 + i * 6, radius: 105, damage: 25,
        type: 'ammo', color: '#ffd700', color2: '#0057b7', stun: 4, kb: 6
      });
    }
    G.blackout = Math.max(G.blackout, .5);
    floatText(f.x + dir * 140, FLOOR - 370, 'NOT A RIDE', '#ffd700', 34);
  } else if (ch.id === 'trump') {
    spawnProjectile(f, {
      x: f.x + dir * 60, y: FLOOR - 205, w: 300, h: 180, vx: dir * 12,
      damage: 37, hits: 6, interval: 8, life: 110, type: 'fire',
      color: '#ff7a1a', color2: '#ffd84d', stun: 4, kb: 6, pierce: true
    });
    ring(f.x, FLOOR - 160, 'rgba(255,120,30,.85)', 290, 32, 9);
    floatText(f.x + dir * 150, FLOOR - 370, "YOU'RE FIRED", '#ff9a3c', 34);
  } else if (ch.id === 'ramaphosa') {
    G.blackout = Math.max(G.blackout, 2.2);
    for (let i = 0; i < 13; i++) {
      spawnHazard(f, {
        x: foe.x + rand(-170, 170), delay: 14 + i * 4, radius: 78, damage: 15,
        type: 'cash', color: '#ffd23f', color2: '#6fbf73', stun: i === 12 ? 100 : 0, kb: 4
      });
    }
    floatText(f.x + dir * 140, FLOOR - 365, 'PHALA PHALA', '#ffd23f', 34);
  } else if (ch.id === 'boris') {
    for (let i = 0; i < 10; i++) {
      spawnHazard(f, {
        x: foe.x + rand(-200, 200), delay: 14 + i * 4, radius: 80, damage: 17,
        type: i % 2 ? 'bottle' : 'confetti', color: '#58d6ff', color2: '#ff2e7a',
        stun: i === 9 ? 85 : 0, kb: 5
      });
    }
    G.flash = 12; G.flashColor = '90,220,255';
    floatText(f.x + dir * 140, FLOOR - 365, 'PARTYGATE', '#58d6ff', 34);
  } else if (ch.id === 'macron') {
    for (let i = 0; i < 6; i++) {
      spawnProjectile(f, {
        x: f.x + dir * 50, y: FLOOR - 125 - i * 14, w: 92, h: 155,
        vx: dir * (8.5 + i * .35), damage: 31, hits: 1, type: 'vest',
        color: '#ffe23a', color2: '#ef4135', stun: 6 + (i === 5 ? 25 : 0), kb: 6,
        life: 100, delay: 0
      });
    }
    floatText(f.x + dir * 140, FLOOR - 370, 'YELLOW VEST STORM', '#ffe23a', 30);
  } else if (ch.id === 'shehbaz') {
    for (let i = 0; i < 6; i++) {
      spawnProjectile(f, {
        x: f.x + dir * (50 + i * 28), y: FLOOR - 150, w: 70, h: 150,
        vx: dir * (19 + i * 1.3), damage: 30, hits: 1, type: 'slash',
        color: '#67ffa8', color2: '#01411c', stun: 3, kb: 5, life: 80, pierce: true
      });
    }
    slashEffect(f.x + dir * 60, FLOOR - 150, dir > 0 ? -.12 : Math.PI + .12, '#67ffa8', 260, 20);
    floatText(f.x + dir * 140, FLOOR - 370, 'PUNJAB SPEED', '#67ffa8', 34);
  } else if (ch.id === 'hasina') {
    spawnProjectile(f, {
      x: f.x + dir * 55, y: FLOOR - 170, w: 210, h: 170, vx: dir * 12.5,
      damage: 40, hits: 5, interval: 11, life: 110, type: 'tiger',
      color: '#ffb347', color2: '#0b3d2e', stun: 4, kb: 8
    });
    ring(f.x + dir * 40, FLOOR - 165, 'rgba(57,255,176,.85)', 230, 28, 8);
    floatText(f.x + dir * 140, FLOOR - 370, 'DELTA TIGER', '#39ffb0', 34);
  } else if (ch.id === 'prabowo') {
    for (let i = 0; i < 7; i++) {
      spawnProjectile(f, {
        x: f.x + dir * 45, y: FLOOR - 150, w: 88, h: 80,
        vx: dir * (7 + (i % 3) * .8), vy: -2.8 + i * .85, damage: 24,
        hits: 1, type: 'heart', color: '#ff7edb', color2: '#fff', stun: 40,
        kb: 4, life: 110, gravity: .025, wobble: 0
      });
    }
    floatText(f.x + dir * 140, FLOOR - 370, 'GEMOY GLOBAL', '#ff7edb', 34);
  }
}

function updateProjectiles(dtf) {
  for (let i = G.projectiles.length - 1; i >= 0; i--) {
    const p = G.projectiles[i];
    p.life -= dtf;
    if (p.delay > 0) { p.delay -= dtf; continue; }
    p.x += p.vx * dtf; p.y += p.vy * dtf;
    if (p.gravity) p.vy += p.gravity * dtf;
    if (p.wobble) p.y = p.baseY + Math.sin((p.maxLife - p.life) * .13) * p.wobble;
    if (p.boomerang) {
      if (p.life < p.maxLife * .55) p.vx = lerp(p.vx, -p.vx * .9, .02 * dtf);
      p.y += Math.sin(p.life * .12) * .4 * dtf;
    }
    p.rot += (p.spin || 0) * dtf;
    if (p.hitTimer > 0) p.hitTimer -= dtf;
    // trail
    if (p.type === 'fire' || p.type === 'beam') {
      if (Math.random() < .7) G.particles.push({ x: p.x + rand(-p.w / 2, p.w / 2), y: p.y + rand(-p.h / 2, p.h / 2), vx: rand(-1, 1), vy: rand(-1.5, .5), life: rand(8, 18), maxLife: 18, size: rand(2, 5), color: choose([p.color, p.color2, '#fff']), gravity: -.02, type: 'spark', rot: 0, vr: 0 });
    }
    if (p.type === 'heart' && Math.random() < .3) G.particles.push({ x: p.x + rand(-20, 20), y: p.y + rand(-20, 20), vx: 0, vy: -.8, life: 20, maxLife: 20, size: 4, color: '#ffb7e6', gravity: 0, type: 'heart', rot: rand(0, TAU), vr: 0 });
    if (p.life <= 0 || p.x < -350 || p.x > W + 350 || p.y > H + 200 || p.y < -300) { G.projectiles.splice(i, 1); continue; }
    const target = G.players[1 - p.owner];
    if (!target || target.hp <= 0) continue;
    if (p.hitTimer > 0) continue;
    const hb = hurtbox(target);
    const box = { x: p.x - p.w / 2, y: p.y - p.h / 2, w: p.w, h: p.h };
    if (rectOverlap(box, hb)) {
      const dir = p.vx > 0 ? 1 : -1;
      hitFighter(G.players[p.owner], target, p.damage, {
        kb: p.kb, stun: p.stun, launch: p.launch, hitstun: p.type === 'beam' ? 10 : 16,
        color: p.color, sourceX: p.x, sourceY: p.y, projectile: true, dir
      });
      p.hits--;
      p.hitTimer = p.interval || 99;
      if (p.hits <= 0) { G.projectiles.splice(i, 1); }
      else if (!p.pierce) { G.projectiles.splice(i, 1); }
    }
  }
}

function updateHazards(dtf) {
  for (let i = G.hazards.length - 1; i >= 0; i--) {
    const h = G.hazards[i];
    h.t += dtf;
    if (!h.done && h.t >= h.delay) {
      h.done = true; h.t = 0;
      const target = G.players[1 - h.owner];
      if (target && target.hp > 0) {
        const tc = { x: target.x, y: target.y - 100 };
        const dist = Math.hypot(tc.x - h.x, tc.y - (FLOOR - 100));
        if (dist < h.radius + 40) {
          hitFighter(G.players[h.owner], target, h.damage, {
            kb: h.kb, stun: h.stun, color: h.color, sourceX: h.x, sourceY: FLOOR - 90,
            projectile: true, dir: target.x > h.x ? 1 : -1, hitstun: 16
          });
        }
      }
      const col = h.color;
      if (h.type === 'lightning') {
        burst(h.x, FLOOR - 110, 30, [col, h.color2, '#fff'], { speed: 13, life: 26, size: 5, gravity: .15 });
        ring(h.x, FLOOR - 30, col, 150, 22, 6);
        G.flash = 8; G.flashColor = '255,230,120'; G.shake = Math.max(G.shake, 12);
      } else if (h.type === 'ammo') {
        burst(h.x, FLOOR - 45, 26, [col, '#ff7a1a', '#fff'], { speed: 11, life: 28, size: 6, gravity: .3 });
        ring(h.x, FLOOR - 25, '#ffb347', 130, 20, 6);
        G.shake = Math.max(G.shake, 10);
      } else if (h.type === 'cash') {
        burst(h.x, FLOOR - 80, 18, ['#ffd23f', '#6fbf73', '#fff'], { speed: 8, life: 30, size: 6, gravity: .25, type: 'bill' });
        G.shake = Math.max(G.shake, 5);
      } else if (h.type === 'bottle') {
        burst(h.x, FLOOR - 60, 18, ['#58d6ff', '#9affd8', '#fff'], { speed: 9, life: 26, size: 4, gravity: .3 });
        G.shake = Math.max(G.shake, 6);
      } else if (h.type === 'confetti') {
        burst(h.x, FLOOR - 90, 26, ['#58d6ff', '#ff2e7a', '#e9ff35', '#fff'], { speed: 8, life: 38, size: 5, gravity: .12, type: 'confetti' });
      } else {
        burst(h.x, FLOOR - 70, 20, [col, '#fff'], { speed: 9, life: 24, size: 5 });
      }
      audio.noise(.2, .16, 300, 3000);
    }
    if (h.done) {
      h.t2 = (h.t2 || 0) + dtf;
      if (h.t2 > 26) G.hazards.splice(i, 1);
    }
  }
}

function drawHazards(g) {
  for (const h of G.hazards) {
    if (!h.done) {
      const prog = clamp(h.t / h.delay, 0, 1);
      // target reticle
      g.save(); g.globalAlpha = .5 + Math.sin(h.t * .4) * .2;
      g.strokeStyle = h.color; g.lineWidth = 2;
      g.beginPath(); g.ellipse(h.x, FLOOR + 2, h.radius * (.4 + prog * .6), h.radius * .22 * (.4 + prog * .6), 0, 0, TAU); g.stroke();
      g.beginPath(); g.moveTo(h.x - 12, FLOOR - 8); g.lineTo(h.x, FLOOR + 4); g.lineTo(h.x + 12, FLOOR - 8); g.stroke();
      g.restore();
      if (h.type === 'lightning') {
        if (prog > .45) {
          g.save(); g.globalAlpha = (prog - .45) * 1.4;
          g.strokeStyle = h.color; g.lineWidth = 4; g.shadowColor = h.color; g.shadowBlur = 18;
          g.beginPath(); g.moveTo(h.x + rand(-20, 20), 0); g.lineTo(h.x + rand(-14, 14), 180); g.lineTo(h.x + rand(-24, 24), 300); g.lineTo(h.x + rand(-12, 12), 420); g.lineTo(h.x, FLOOR - 8); g.stroke();
          g.restore();
        }
      } else if (h.type === 'ammo') {
        const y = lerp(-80, FLOOR - 55, prog);
        g.save(); g.translate(h.x, y);
        g.fillStyle = '#4a5a3c'; g.fillRect(-22, -16, 44, 32);
        g.fillStyle = '#2e3a26'; g.fillRect(-22, 2, 44, 6);
        g.strokeStyle = 'rgba(255,255,255,.3)'; g.lineWidth = 1; g.strokeRect(-22, -16, 44, 32);
        g.fillStyle = h.color2; g.fillRect(-10, -8, 20, 6);
        g.fillStyle = 'rgba(240,240,230,.8)'; g.beginPath(); g.moveTo(-24, -18); g.quadraticCurveTo(0, -52, 24, -18); g.closePath(); g.fill();
        g.strokeStyle = 'rgba(80,80,80,.7)'; g.beginPath(); g.moveTo(-24, -18); g.lineTo(0, 0); g.lineTo(24, -18); g.stroke();
        g.restore();
      } else if (h.type === 'cash') {
        const y = lerp(-50, FLOOR - 60, prog);
        g.save(); g.translate(h.x, y); g.rotate(prog * 4);
        g.fillStyle = '#7ecb82'; g.fillRect(-20, -12, 40, 24);
        g.strokeStyle = 'rgba(0,0,0,.4)'; g.strokeRect(-20, -12, 40, 24);
        g.fillStyle = '#3f8b45'; g.fillRect(-6, -6, 12, 12);
        g.restore();
      } else if (h.type === 'bottle') {
        const y = lerp(-50, FLOOR - 50, prog);
        g.save(); g.translate(h.x, y); g.rotate(prog * 7);
        g.fillStyle = '#2d6b3a'; g.fillRect(-7, -20, 14, 40);
        g.fillStyle = '#1b4526'; g.fillRect(-4, -34, 8, 16);
        g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(-4, -16, 3, 22);
        g.restore();
      } else if (h.type === 'confetti') {
        g.save(); g.globalAlpha = prog;
        g.fillStyle = h.color; g.beginPath(); g.arc(h.x, lerp(-40, FLOOR - 40, prog), 6, 0, TAU); g.fill(); g.restore();
      }
    } else {
      // explosion flash
      const a = clamp(1 - (h.t2 || 0) / 26, 0, 1);
      g.save(); g.globalAlpha = a * .85;
      const gr = g.createRadialGradient(h.x, FLOOR - 80, 5, h.x, FLOOR - 80, h.radius);
      gr.addColorStop(0, 'rgba(255,255,255,.9)'); gr.addColorStop(.35, h.color); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.beginPath(); g.arc(h.x, FLOOR - 80, h.radius, 0, TAU); g.fill(); g.restore();
    }
  }
}

function drawProjectiles(g) {
  for (const p of G.projectiles) {
    if (p.delay > 0) continue;
    g.save(); g.translate(p.x, p.y);
    const pulse = 1 + Math.sin((p.maxLife - p.life) * .28) * .04;
    g.scale(pulse, pulse);
    g.shadowColor = p.color; g.shadowBlur = 20;
    if (p.type === 'wave') {
      for (let i = 0; i < 3; i++) {
        g.globalAlpha = .85 - i * .2;
        g.strokeStyle = i === 0 ? p.color2 : p.color; g.lineWidth = 9 - i * 2.4;
        g.beginPath(); g.arc(-i * 12 * sign(p.vx), 0, p.w * .5 - i * 7, -1.2, 1.2); g.stroke();
      }
      g.globalAlpha = 1; g.fillStyle = '#fff'; g.beginPath(); g.arc(-p.w * .2 * sign(p.vx), -12, 5, 0, TAU); g.fill();
    } else if (p.type === 'covfefe') {
      g.rotate(Math.sin(p.life * .12) * .18);
      g.fillStyle = '#f2e9dc'; g.beginPath(); g.moveTo(-24, -20); g.lineTo(24, -20); g.lineTo(18, 20); g.lineTo(-18, 20); g.closePath(); g.fill();
      g.fillStyle = p.color; g.beginPath(); g.ellipse(0, -19, 24, 7, 0, 0, TAU); g.fill();
      g.strokeStyle = '#fff'; g.lineWidth = 4; g.beginPath(); g.arc(30, -2, 12, -1.2, 1.2); g.stroke();
      g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 3;
      for (let i = -1; i <= 1; i++) { g.beginPath(); g.moveTo(i * 12, -32); g.quadraticCurveTo(i * 12 + 8, -44, i * 12, -54); g.stroke(); }
      g.fillStyle = '#6b3f25'; g.font = 'italic 900 10px Clash, Impact, sans-serif'; g.textAlign = 'center'; g.fillText('COVFEFE', 0, 6);
    } else if (p.type === 'baguette') {
      g.rotate(p.rot);
      g.fillStyle = p.color; rr(g, -48, -15, 96, 30, 15); g.fill();
      g.strokeStyle = p.color2; g.lineWidth = 3;
      for (let i = -2; i <= 2; i++) { g.beginPath(); g.moveTo(i * 16 - 7, -12); g.lineTo(i * 16 + 6, 12); g.stroke(); }
      g.fillStyle = 'rgba(255,255,255,.25)'; rr(g, -44, -11, 70, 6, 3); g.fill();
      g.font = 'italic 900 8px Clash, Impact, sans-serif'; g.fillStyle = '#6e441d'; g.textAlign = 'center'; g.fillText('FRANCE', 0, 1);
    } else if (p.type === 'heart') {
      const s = p.w / 60;
      g.scale(s, s);
      g.fillStyle = '#ff7edb'; g.beginPath(); g.moveTo(0, 22); g.bezierCurveTo(-45, -8, -25, -38, 0, -16); g.bezierCurveTo(25, -38, 45, -8, 0, 22); g.fill();
      g.fillStyle = 'rgba(255,255,255,.45)'; g.beginPath(); g.ellipse(-15, -16, 7, 4, -.6, 0, TAU); g.fill();
    } else if (p.type === 'beam') {
      const w = p.w, h = p.h;
      const grd = g.createLinearGradient(-w / 2, 0, w / 2, 0);
      grd.addColorStop(0, 'rgba(255,255,255,0)'); grd.addColorStop(.25, p.color); grd.addColorStop(.6, '#fff'); grd.addColorStop(1, p.color2);
      g.fillStyle = grd; g.globalAlpha = .9;
      g.beginPath(); g.moveTo(-w / 2 * sign(p.vx), -18); g.lineTo(w / 2 * sign(p.vx), -h / 2); g.lineTo(w / 2 * sign(p.vx), h / 2); g.lineTo(-w / 2 * sign(p.vx), 18); g.closePath(); g.fill();
      g.globalAlpha = 1; g.strokeStyle = '#fff'; g.lineWidth = 3; g.beginPath(); g.moveTo(-w / 2, 0); g.lineTo(w / 2, 0); g.stroke();
    } else if (p.type === 'train') {
      g.fillStyle = '#c9c4ba'; rr(g, -150, -85, 300, 140, 8); g.fill();
      g.fillStyle = p.color; rr(g, -150, -85, 300, 34, 8); g.fill();
      g.fillStyle = p.color2; g.fillRect(-150, -36, 300, 10);
      g.fillStyle = '#1a2a38';
      for (let i = 0; i < 5; i++) { rr(g, -132 + i * 56, -52, 40, 26, 4); g.fill(); }
      g.fillStyle = '#2b2b2b'; g.fillRect(-150, 55, 300, 12);
      g.fillStyle = '#ffde00'; g.font = 'italic 900 16px Clash, Impact, sans-serif'; g.textAlign = 'center'; g.fillText('BELT & ROAD EXPRESS', 0, 40);
    } else if (p.type === 'bear') {
      g.fillStyle = p.color;
      g.beginPath(); g.ellipse(0, 10, 92, 72, 0, 0, TAU); g.fill();
      g.beginPath(); g.arc(-52, -55, 34, 0, TAU); g.fill();
      g.beginPath(); g.arc(52, -55, 34, 0, TAU); g.fill();
      g.beginPath(); g.arc(0, -42, 62, 0, TAU); g.fill();
      g.fillStyle = '#2b1e18'; g.beginPath(); g.arc(-52, -55, 17, 0, TAU); g.fill(); g.beginPath(); g.arc(52, -55, 17, 0, TAU); g.fill();
      g.fillStyle = '#f0ede4'; g.beginPath(); g.ellipse(0, 0, 24, 18, 0, 0, TAU); g.fill();
      g.fillStyle = '#111'; g.beginPath(); g.arc(-23, -58, 6, 0, TAU); g.fill(); g.beginPath(); g.arc(23, -58, 6, 0, TAU); g.fill();
      g.fillStyle = '#111'; g.beginPath(); g.ellipse(0, -30, 8, 6, 0, 0, TAU); g.fill();
      g.strokeStyle = '#f0ede4'; g.lineWidth = 4;
      g.beginPath(); g.moveTo(-14, -12); g.lineTo(-28, -2); g.moveTo(14, -12); g.lineTo(28, -2); g.stroke();
      g.fillStyle = 'rgba(255,255,255,.9)'; g.font = 'italic 900 12px Clash, Impact, sans-serif'; g.textAlign = 'center'; g.fillText('RUSSIA', 0, 40);
    } else if (p.type === 'fire') {
      g.globalAlpha = .9;
      const grd = g.createLinearGradient(-p.w / 2, 0, p.w / 2, 0);
      grd.addColorStop(0, 'rgba(255,60,10,0)'); grd.addColorStop(.3, p.color); grd.addColorStop(.6, p.color2); grd.addColorStop(1, '#fff6c8');
      g.fillStyle = grd;
      g.beginPath();
      for (let i = 0; i <= 12; i++) { const a = i / 12 * TAU; const rx = p.w / 2 * (0.8 + Math.sin(i * 1.7) * .2), ry = p.h / 2 * (0.8 + Math.cos(i * 2.1) * .2); g.lineTo(Math.cos(a) * rx, Math.sin(a) * ry); }
      g.closePath(); g.fill();
      g.fillStyle = '#fff'; g.font = 'italic 900 22px Clash, Impact, sans-serif'; g.textAlign = 'center'; g.fillText("YOU'RE FIRED!", 0, 6);
    } else if (p.type === 'blackout') {
      g.fillStyle = '#05050a'; g.beginPath(); g.arc(0, 0, p.w / 2, 0, TAU); g.fill();
      g.strokeStyle = p.color; g.lineWidth = 4; g.beginPath(); g.arc(0, 0, p.w / 2 - 4, 0, TAU); g.stroke();
      g.fillStyle = '#ffd23f'; g.font = '900 16px Clash, Impact, sans-serif'; g.textAlign = 'center'; g.fillText('⚡', 0, 5);
      g.strokeStyle = '#ffd23f'; g.lineWidth = 3;
      for (let i = 0; i < 4; i++) { const a = p.rot + i * TAU / 4; g.beginPath(); g.moveTo(Math.cos(a) * 20, Math.sin(a) * 20); g.lineTo(Math.cos(a) * 44, Math.sin(a) * 44); g.stroke(); }
    } else if (p.type === 'vest') {
      g.fillStyle = 'rgba(255,226,58,.9)'; g.beginPath(); g.moveTo(-34, -70); g.lineTo(34, -70); g.lineTo(42, 70); g.lineTo(-42, 70); g.closePath(); g.fill();
      g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(-30, -60, 60, 12); g.fillRect(-30, -38, 60, 12);
      g.fillStyle = '#2b2b2b'; g.beginPath(); g.arc(0, -22, 24, 0, TAU); g.fill();
      g.fillStyle = '#ff2e7a'; g.font = 'italic 900 12px Clash, Impact, sans-serif'; g.textAlign = 'center'; g.fillText('NON!', 0, 20);
      g.strokeStyle = '#2b2b2b'; g.lineWidth = 6; g.beginPath(); g.moveTo(38, -30); g.lineTo(62, -60); g.stroke();
    } else if (p.type === 'slash') {
      g.strokeStyle = p.color; g.lineWidth = 12; g.shadowColor = p.color; g.shadowBlur = 18;
      for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(-10 - i * 4, -70 + i * 20); g.lineTo(52, 10 + i * 16); g.stroke(); }
      g.strokeStyle = '#fff'; g.lineWidth = 3;
      for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(-6 - i * 4, -66 + i * 20); g.lineTo(48, 8 + i * 16); g.stroke(); }
    } else if (p.type === 'tiger') {
      g.fillStyle = '#ffb347'; g.beginPath(); g.arc(0, 0, 82, 0, TAU); g.fill();
      g.fillStyle = '#ffd67a'; g.beginPath(); g.arc(0, 5, 58, 0, TAU); g.fill();
      g.fillStyle = '#ffb347'; g.beginPath(); g.arc(-58, -58, 28, 0, TAU); g.fill(); g.beginPath(); g.arc(58, -58, 28, 0, TAU); g.fill();
      g.strokeStyle = '#3a1d14'; g.lineWidth = 8;
      for (const side of [-1, 1]) { for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(side * (10 + i * 12), -50 + i * 8); g.lineTo(side * (26 + i * 12), -38 + i * 8); g.stroke(); } }
      g.fillStyle = '#3a1d14'; g.beginPath(); g.arc(-26, -8, 9, 0, TAU); g.fill(); g.beginPath(); g.arc(26, -8, 9, 0, TAU); g.fill();
      g.fillStyle = '#fff'; g.beginPath(); g.ellipse(0, 32, 28, 18, 0, 0, TAU); g.fill();
      g.fillStyle = '#3a1d14'; g.beginPath(); g.moveTo(0, 26); g.lineTo(9, 38); g.lineTo(-9, 38); g.closePath(); g.fill();
      g.strokeStyle = '#fff'; g.lineWidth = 3; g.beginPath(); g.moveTo(-20, 30); g.lineTo(-58, 18); g.moveTo(20, 30); g.lineTo(58, 18); g.stroke();
      g.fillStyle = '#0b3d2e'; g.font = 'italic 900 12px Clash, Impact, sans-serif'; g.textAlign = 'center'; g.fillText('BENGAL', 0, 62);
    }
    g.restore();
  }
  g.shadowBlur = 0;
}

/* ============================ FIGHTER LOGIC ============================ */
function foeOf(f) { return G.players[1 - f.index]; }
function hurtbox(f) { return { x: f.x - 40, y: f.y - 218, w: 80, h: 218 }; }
function rectOverlap(a, b) { return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y; }
function attackBox(f, a) {
  let range = a.range, y = f.y + (a.hitY ?? -196), h = a.hitH ?? 84;
  if (a.kind === 'heavy') { y = f.y - 220; h = 110; }
  return { x: f.facing > 0 ? f.x + 20 : f.x - 20 - range, y, w: range, h };
}

function inputFor(f, dtf) {
  if (f.isAI) return aiInput(f, dtf);
  if (isTouch && f.index === 0) return humanInput(0);
  return humanInput(f.index);
}

function startMove(f, kind) {
  if (f.hp <= 0 || f.hitstun > 0 || f.stun > 0) return false;
  if (f.state === 'attack') return false;
  if (kind === 'light' || kind === 'heavy') {
    const m = MOVES[kind];
    f.state = 'attack'; f.attackT = 0; f.hitDone = false;
    f.attack = { ...m, total: m.startup + m.active + m.recovery, fired: false };
    audio.whoosh();
    return true;
  }
  if (kind === 'special') {
    if (f.cooldown > 0) return false;
    const inf = SPECIAL_INFO[f.char.id] || SPECIAL_INFO.modi;
    f.cooldown = 155;
    f.state = 'attack'; f.attackT = 0;
    f.attack = {
      kind: 'special', charKind: f.char.specialKind, name: f.char.special,
      windup: 13, total: inf.total, fireAt: inf.fireAt, fired: false,
      dash: inf.dash, dashFrom: inf.dashFrom, dashTo: inf.dashTo, dashSpeed: inf.dashSpeed,
      damage: inf.damage, hit: false, hitstun: inf.hitstun, kb: inf.kb
    };
    f.aura = 22;
    G.stats.specials++;
    audio.special();
    return true;
  }
  if (kind === 'super') {
    if (f.meter < 100) return false;
    f.meter = 0;
    f.state = 'attack'; f.attackT = 0;
    f.attack = {
      kind: 'super', charKind: f.char.specialKind, name: f.char.super,
      windup: 34, total: 86, fired: false, charId: f.char.id
    };
    f.invuln = 50; f.aura = 80;
    G.superFlash = 32; G.superColor = f.char.glow;
    G.hitstop = 14; G.shake = Math.max(G.shake, 8);
    G.stats.supers++;
    announce(f.char.super, 'SUPER ART', 1.4);
    audio.super();
    burst(f.x, FLOOR - 110, 34, [f.char.c1, f.char.c2, f.char.glow, '#fff'], { speed: 12, life: 34, size: 5, gravity: -.02, type: 'star' });
    ring(f.x, FLOOR - 120, f.char.glow, 260, 30, 7);
    return true;
  }
  return false;
}

function updateAttack(f, dtf) {
  const a = f.attack;
  if (!a) { f.state = 'idle'; return; }
  f.attackT += dtf;
  const t = f.attackT;
  const foe = foeOf(f);
  if (a.kind === 'light' || a.kind === 'heavy') {
    if (t >= a.startup && t <= a.startup + a.active && !a.hitDone) {
      const box = attackBox(f, a);
      if (rectOverlap(box, hurtbox(foe))) {
        a.hitDone = true;
        const dir = f.facing;
        hitFighter(f, foe, a.damage * f.char.power, {
          kb: a.kb, hitstun: a.hitstun, color: f.char.glow, sourceX: f.x + dir * 60, sourceY: f.y - 160,
          dir, hitstop: a.hitstop, heavy: a.kind === 'heavy'
        });
        slashEffect(f.x + dir * 54, f.y - 160, dir > 0 ? -.15 : Math.PI + .15, f.char.glow, a.kind === 'heavy' ? 150 : 100, 10);
      }
    }
    if (t > a.total) { f.attack = null; f.state = 'idle'; }
  } else if (a.kind === 'special') {
    if (a.dash && t >= a.dashFrom && t <= a.dashTo) {
      f.x += f.facing * a.dashSpeed * dtf;
      f.x = clamp(f.x, 80, W - 80);
      if (Math.random() < .7) dust(f.x - f.facing * 20, FLOOR, 2, -f.facing);
      if (Math.random() < .8) { f.trail.push({ x: f.x, y: f.y, life: 12, facing: f.facing, char: f.char }); }
      const box = { x: f.facing > 0 ? f.x + 6 : f.x - 6 - 112, y: f.y - 210, w: 112, h: 190 };
      if (!a.hit && rectOverlap(box, hurtbox(foe))) {
        a.hit = true;
        hitFighter(f, foe, (a.damage || 78) * f.char.power, {
          kb: a.kb || 9, hitstun: a.hitstun || 22, color: f.char.glow,
          sourceX: f.x + f.facing * 50, sourceY: f.y - 150, dir: f.facing, heavy: true
        });
      }
    }
    if (!a.fired && t >= (a.fireAt || 14)) {
      a.fired = true;
      shootSpecial(f, a);
    }
    if (t > a.total) { f.attack = null; f.state = 'idle'; }
  } else if (a.kind === 'super') {
    if (!a.fired && t >= a.windup) {
      a.fired = true;
      shootSuper(f, a);
      G.superFlash = 26; G.superColor = f.char.glow;
    }
    if (t > a.total) { f.attack = null; f.state = 'idle'; }
  }
  if (f.trail.length) {
    for (let i = f.trail.length - 1; i >= 0; i--) { f.trail[i].life -= dtf; if (f.trail[i].life <= 0) f.trail.splice(i, 1); }
  }
}

function hitFighter(att, target, dmg, opts = {}) {
  if (!att || !target || target.hp <= 0 || target.invuln > 0) return false;
  const dir = opts.dir ?? (target.x > att.x ? 1 : -1);
  const facingAttacker = target.facing === (att.x > target.x ? 1 : -1);
  const blocked = target.state === 'block' && target.grounded && facingAttacker;
  let actual = dmg;
  if (blocked) actual = Math.max(4, dmg * (opts.unblockable ? 1 : .17));
  target.hp = Math.max(0, target.hp - actual);
  target.flash = blocked ? 4 : 7;
  target.lastHitBy = att.index;
  target.meter = clamp(target.meter + (blocked ? 7 : 5 + actual * .035), 0, 100);
  att.meter = clamp(att.meter + (blocked ? 3 : 4 + actual * .025), 0, 100);
  G.hitstop = Math.max(G.hitstop, blocked ? 3 : (opts.hitstop ?? (dmg > 60 ? 7 : 5)));
  G.shake = Math.max(G.shake, blocked ? 2 : clamp(dmg * .12, 2, 12));
  G.stats.hits++;
  const sx = opts.sourceX ?? (att.x + dir * 50);
  const sy = opts.sourceY ?? (target.y - 150);
  if (blocked) {
    burst(sx, sy, 9, ['#d8f6ff', '#7fe6ff', '#ffffff'], { speed: 6, life: 16, size: 3, gravity: .1 });
    ring(sx, sy, 'rgba(180,240,255,.8)', 40, 12, 2);
    audio.block();
    target.blockstun = 12;
    target.vx += dir * (opts.kb || 4) * .35;
    floatText(sx, sy - 20, 'BLOCK', '#bdefff', 18);
  } else {
    const col = opts.color || att.char.glow;
    burst(sx, sy, opts.heavy ? 24 : 15, [col, att.char.c1, '#fff', '#ffe9a8'], { speed: opts.heavy ? 11 : 8, life: 26, size: opts.heavy ? 5 : 4, gravity: .22 });
    burst(sx, sy, 7, '#fff', { speed: 14, life: 10, size: 6, gravity: 0, type: 'star' });
    ring(sx, sy, col + 'cc', opts.heavy ? 80 : 55, 14, 3);
    slashEffect(sx, sy, dir > 0 ? -.4 : Math.PI + .4, col, opts.heavy ? 140 : 90, 9);
    floatText(sx + rand(-10, 10), sy - 30, Math.round(actual), '#fff', opts.heavy ? 34 : 27);
    audio.punch(opts.heavy);
    target.hitstun = Math.max(target.hitstun, opts.hitstun || (opts.heavy ? 20 : 14));
    target.state = 'hurt';
    target.attack = null;
    target.stateT = 0;
    target.vx = dir * (opts.kb || 5) * (target.char.weight || 1);
    if (opts.launch) { target.vy = -7.5; target.grounded = false; }
    if (opts.stun) target.stun = Math.max(target.stun, opts.stun);
    // combo
    if (att.comboT > 0) att.combo++; else att.combo = 1;
    att.comboT = 1.4;
    audio.crowd(opts.heavy ? 1.2 : .7);
    G.flash = Math.max(G.flash, opts.heavy ? 3 : 1);
    G.flashColor = '255,245,200';
  }
  if (target.hp <= 0) triggerKO(target, att);
  return true;
}

function triggerKO(loser, winner) {
  if (G.roundState === 'ko' || G.roundState === 'concluded') return;
  loser.state = 'ko'; loser.koT = 0; loser.attack = null; loser.hitstun = 0; loser.stun = 0; loser.vx = sign(loser.x - winner.x) * 5; loser.vy = -4; loser.grounded = false;
  if (winner) { winner.state = 'win'; winner.attack = null; winner.vx = 0; }
  G.roundState = 'ko'; G.roundT = 0; G.slowT = 1.5;
  G.hitstop = 22; G.shake = 20; G.flash = 16; G.flashColor = '255,240,180';
  audio.ko();
  ring(loser.x, loser.y - 100, 'rgba(255,240,180,.9)', 300, 40, 8);
  burst(loser.x, loser.y - 120, 50, ['#e9ff35', '#ff2e7a', '#fff', '#ffb347'], { speed: 15, life: 48, size: 6, gravity: .12, type: 'star' });
  announce('K.O.', 'ROUND ' + G.round, 2.4);
  if (G.players[0].hp <= 0 && G.players[1].hp <= 0) announce('DOUBLE K.O.', 'DEMOCRACY IS CONFUSED', 2.4);
}

function aiInput(f, dtf) {
  const foe = foeOf(f), ai = f.ai;
  const out = { left: false, right: false, up: false, block: false, punch: false, kick: false, special: false, super: false };
  if (f.hp <= 0) return out;
  const dist = Math.abs(foe.x - f.x);
  const toward = foe.x > f.x ? 'right' : 'left';
  const away = toward === 'right' ? 'left' : 'right';
  ai.timer -= dtf;
  if (ai.blockTimer > 0) { ai.blockTimer -= dtf; out.block = true; }
  // react to obvious attacks
  if (foe.state === 'attack' && dist < 215 && ai.blockTimer <= 0 && Math.random() < .025 * dtf) ai.blockTimer = rand(18, 32);
  if (ai.timer <= 0) {
    ai.timer = rand(11, 28);
    ai.move = 0;
    if (dist > 340) {
      ai.move = toward;
      if (Math.random() < .1) out.up = true;
    } else if (dist > 180) {
      ai.move = Math.random() < .78 ? toward : (Math.random() < .5 ? away : 0);
      if (Math.random() < .3) out.kick = true;
      else if (Math.random() < .18 && f.cooldown <= 0) out.special = true;
    } else {
      const r = Math.random();
      if (r < .35) out.punch = true;
      else if (r < .67) out.kick = true;
      else if (r < .82 && f.cooldown <= 0) out.special = true;
      else if (r < .9) ai.move = away;
      if (Math.random() < .18) ai.move = away;
    }
    if (f.meter >= 100 && dist < 620 && Math.random() < .62) out.super = true;
    if (f.cooldown <= 0 && dist < 480 && Math.random() < .16) out.special = true;
    if (foe.state === 'hurt' || foe.state === 'stun') { ai.move = toward; if (dist < 150 && Math.random() < .65) out.punch = true; }
  }
  if (ai.move === 'left') out.left = true;
  if (ai.move === 'right') out.right = true;
  // keep facing / spacing
  if (dist < 95 && foe.state !== 'hurt') out.block = out.block || Math.random() < .012;
  return out;
}

function applyInput(f, inp, dtf) {
  if (f.hp <= 0) return;
  const ch = f.char;
  const speed = 3.15 * ch.speed;
  if (f.state === 'attack') { updateAttack(f, dtf); return; }
  if (f.hitstun > 0) { f.state = 'hurt'; return; }
  if (f.stun > 0) { f.state = 'stun'; return; }
  if (f.state === 'ko') return;
  if (!f.grounded) {
    // air control
    if (inp.left) f.x -= speed * .55 * dtf;
    if (inp.right) f.x += speed * .55 * dtf;
    if (inp.punch) startMove(f, 'light');
    else if (inp.kick) startMove(f, 'heavy');
    else if (inp.special) startMove(f, 'special');
    else if (inp.super) startMove(f, 'super');
    return;
  }
  if (inp.super && startMove(f, 'super')) return;
  if (inp.special && startMove(f, 'special')) return;
  if (inp.kick && startMove(f, 'heavy')) return;
  if (inp.punch && startMove(f, 'light')) return;
  if (inp.up) {
    f.vy = -12.4; f.grounded = false; f.state = 'jump'; f.y -= 1;
    dust(f.x, FLOOR, 9); audio.whoosh();
    return;
  }
  if (inp.block) {
    f.state = 'block'; f.blockstun = Math.max(0, f.blockstun);
    f.walkPhase += dtf;
    return;
  }
  let moving = 0;
  if (inp.left) moving -= 1;
  if (inp.right) moving += 1;
  if (moving) {
    const back = (moving < 0 ? -1 : 1) !== f.facing;
    f.x += moving * speed * (back ? .74 : 1) * dtf;
    f.state = 'walk'; f.walkPhase += dtf * (back ? .8 : 1);
    if (Math.random() < .05) dust(f.x - f.facing * 12, FLOOR, 1);
  } else {
    f.state = 'idle';
  }
  f.x = clamp(f.x, 74, W - 74);
}

function updateFighter(f, dtf, locked = false) {
  if (f.flash > 0) f.flash -= dtf;
  if (f.invuln > 0) f.invuln -= dtf;
  if (f.aura > 0) f.aura -= dtf;
  if (f.cooldown > 0) f.cooldown -= dtf;
  if (f.comboT > 0) { f.comboT -= dtf; if (f.comboT <= 0) f.combo = 0; }
  if (f.blockstun > 0) f.blockstun -= dtf;
  if (f.state === 'ko') {
    f.koT += dtf;
    f.vy += .55 * dtf; f.y += f.vy * dtf; f.x += f.vx * dtf; f.vx *= .96;
    if (f.y > FLOOR) { f.y = FLOOR; f.vy = 0; }
    f.x = clamp(f.x, 70, W - 70);
    return;
  }
  if (locked) {
    if (f.grounded) f.state = 'idle';
    f.x += f.vx * dtf; f.vx *= .84;
    if (!f.grounded) { f.vy += .6 * dtf; f.y += f.vy * dtf; if (f.y >= FLOOR) { f.y = FLOOR; f.vy = 0; f.grounded = true; f.state = 'idle'; } }
    return;
  }
  if (f.hitstun > 0) {
    f.hitstun -= dtf;
    f.state = 'hurt';
    f.x += f.vx * dtf; f.vx *= .88;
    if (!f.grounded) { f.vy += .62 * dtf; f.y += f.vy * dtf; if (f.y >= FLOOR) { f.y = FLOOR; f.vy = 0; f.grounded = true; dust(f.x, FLOOR, 8); } }
    if (f.hitstun <= 0) { f.state = f.stun > 0 ? 'stun' : 'idle'; }
    f.x = clamp(f.x, 74, W - 74);
    return;
  }
  if (f.stun > 0) {
    f.stun -= dtf; f.state = 'stun';
    f.x += f.vx * dtf; f.vx *= .9;
    if (f.stun <= 0) f.state = 'idle';
    f.x = clamp(f.x, 74, W - 74);
    return;
  }
  if (f.state === 'win') { f.x += f.vx * dtf; f.vx *= .9; return; }
  // face opponent
  if (f.grounded && f.state !== 'attack') {
    const foe = foeOf(f);
    if (foe) f.facing = foe.x >= f.x ? 1 : -1;
  }
  const inp = inputFor(f, dtf);
  applyInput(f, inp, dtf);
  // gravity
  if (!f.grounded) {
    f.vy += .62 * dtf; f.y += f.vy * dtf;
    if (f.y >= FLOOR) {
      f.y = FLOOR; f.vy = 0; f.grounded = true;
      if (f.state !== 'attack') f.state = 'idle';
      dust(f.x, FLOOR, 8);
    }
  }
  if (f.state === 'block') f.vx *= .8;
  f.x += f.vx * dtf; f.vx *= .86;
  f.x = clamp(f.x, 74, W - 74);
}

/* ============================ MATCH FLOW ============================ */
const ui = {};
function cacheUI() {
  ['title','select','stageSelect','vsScreen','results','pause','howto','hud','touch','announce',
   'hp1','hp2','ghost1','ghost2','timer','roundTag','name1','name2','flag1','flag2','tag1','tag2',
   'pips1','pips2','meter1','meter2','superName1','superName2','stageTag','combo1','combo2',
   'modeLabel','slot1','slot2','slotFace1','slotFace2','slotName1','slotName2','slotPower1',
   'slotPower2','pickHelp','startFightBtn','slotTag2','roster','resultFace','resultTitle',
   'resultSub','resultQuote','vsFace1','vsFace2','vsName1','vsName2','vsCountry1','vsCountry2',
   'vsStage','muteBtn','pauseBtn','fightHint','backToTitle','randomBtn','backToSelect',
   'rematchBtn','resultSelectBtn','resultTitleBtn','resumeBtn','restartBtn','quitBtn',
   'closeHowto','howtoOk'].forEach(id => ui[id] = $(id));
}
let rosterCards = [];
let lastPortraitPaint = 0;

function refreshAttract() {
  const a = choose(CHARS), b = choose(CHARS.filter(c => c.id !== a.id));
  G.attract = [makeFighter(a.id, 0, 838), makeFighter(b.id, 1, 1112)];
  G.attract[0].facing = 1; G.attract[1].facing = -1;
  G.attractStage = choose(['india', 'desert', 'snow']);
}

function showScreen(name) {
  G.screen = name;
  const app = document.getElementById('app');
  if (app) app.dataset.screen = name;
  document.querySelectorAll('.screen').forEach(el => el.classList.add('hidden'));
  if (name === 'fight' || name === 'results') {
    ui.hud.classList.toggle('hidden', name !== 'fight');
  } else {
    ui.hud.classList.add('hidden');
  }
  if (name === 'title') ui.title.classList.remove('hidden');
  if (name === 'select') ui.select.classList.remove('hidden');
  if (name === 'stage') ui.stageSelect.classList.remove('hidden');
  if (name === 'vs') ui.vsScreen.classList.remove('hidden');
  if (name === 'results') ui.results.classList.remove('hidden');
  if (name === 'howto') ui.howto.classList.remove('hidden');
  ui.pause.classList.add('hidden');
  G.paused = false;
  updatePauseBtn();
  updateTouchVisibility();
}

function updatePauseBtn() {
  const can = G.screen === 'fight';
  ui.pauseBtn.classList.toggle('pause-disabled', !can);
  ui.pauseBtn.textContent = G.paused ? '▶' : 'Ⅱ';
}
function updateTouchVisibility() {
  const show = !!isTouch && G.screen === 'fight' && !G.paused;
  ui.touch.classList.toggle('hidden', !show);
}

function announce(main, sub = '', dur = 1.4) {
  G.annMain = main; G.annSub = sub; G.annT = dur;
  const el = ui.announce;
  el.querySelector('.ann-main').textContent = main;
  el.querySelector('.ann-sub').textContent = sub;
  el.classList.remove('show'); void el.offsetWidth; el.classList.add('show');
}
function updateAnnouncements(dt) {
  if (G.annT > 0) {
    G.annT -= dt;
    if (G.annT <= 0) ui.announce.classList.remove('show');
  }
}

function openSelect(mode) {
  G.mode = mode;
  G.sel = { p1: null, p2: null, active: 0 };
  ui.modeLabel.textContent = mode === 'cpu' ? 'VS CPU' : 'LOCAL 2P';
  ui.slotTag2.textContent = mode === 'cpu' ? 'CPU' : 'P2';
  refreshSelectionUI();
  showScreen('select');
  audio.ui();
  paintSelectionPortraits(G.time, true);
}
function refreshSelectionUI() {
  const s = G.sel;
  const c1 = s.p1 ? CHAR_BY_ID[s.p1] : null;
  const c2 = s.p2 ? CHAR_BY_ID[s.p2] : null;
  ui.slotName1.textContent = c1 ? c1.name : 'AWAITING PICK';
  ui.slotName2.textContent = c2 ? c2.name : 'AWAITING PICK';
  ui.slotPower1.textContent = c1 ? c1.special : '—';
  ui.slotPower2.textContent = c2 ? c2.special : '—';
  ui.slot1.classList.toggle('active', s.active === 0);
  ui.slot2.classList.toggle('active', s.active === 1);
  ui.pickHelp.textContent = s.active === 0 ? 'P1 — PICK YOUR FIGHTER' : (G.mode === 'cpu' ? 'CPU — PICK YOUR OPPONENT' : 'P2 — PICK YOUR FIGHTER');
  ui.startFightBtn.disabled = !(s.p1 && s.p2);
  rosterCards.forEach(card => {
    const id = card.dataset.id;
    card.classList.toggle('p1', s.p1 === id);
    card.classList.toggle('p2', s.p2 === id);
    let badge = card.querySelector('.sel-badge');
    if (!badge) { badge = document.createElement('div'); badge.className = 'sel-badge'; card.appendChild(badge); }
    if (s.p1 === id && s.p2 === id) badge.innerHTML = '<i class="both">P1+P2</i>';
    else if (s.p1 === id) badge.innerHTML = '<i>P1</i>';
    else if (s.p2 === id) badge.innerHTML = '<i class="b2">P2</i>';
    else badge.innerHTML = '';
  });
  paintSlotFaces();
}
function paintSlotFaces() {
  const s = G.sel;
  paintSlotFace(ui.slotFace1, s.p1 ? CHAR_BY_ID[s.p1] : null);
  paintSlotFace(ui.slotFace2, s.p2 ? CHAR_BY_ID[s.p2] : null);
}
function paintSlotFace(cv, ch) {
  const g = cv.getContext('2d');
  if (!ch) {
    g.clearRect(0, 0, cv.width, cv.height);
    g.fillStyle = '#101018'; g.fillRect(0, 0, cv.width, cv.height);
    g.strokeStyle = 'rgba(244,240,230,.2)'; g.setLineDash([5, 6]); g.strokeRect(5, 5, cv.width - 10, cv.height - 10); g.setLineDash([]);
    g.fillStyle = 'rgba(244,240,230,.32)'; g.font = 'italic 900 54px Clash, Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('?', cv.width / 2, cv.height / 2);
    return;
  }
  paintPortrait(cv, ch, G.time, 'slot');
}
function paintSelectionPortraits(t, force = false) {
  if (!force && t - lastPortraitPaint < .075) { paintSlotFaces(); return; }
  lastPortraitPaint = t;
  for (const card of rosterCards) {
    const ch = CHAR_BY_ID[card.dataset.id];
    if (ch) paintPortrait(card.querySelector('canvas'), ch, t + ch.name.length, 'card');
  }
  paintSlotFaces();
}
function buildRoster() {
  const roster = ui.roster;
  roster.innerHTML = '';
  rosterCards = [];
  CHARS.forEach((ch, idx) => {
    const card = document.createElement('button');
    card.className = 'card';
    card.dataset.id = ch.id;
    card.style.setProperty('--i', idx);
    card.innerHTML = `<canvas width="190" height="186"></canvas>
      <div class="card-meta">
        <div class="cname"><span>${ch.name}</span><span class="cflag">${ch.flag}</span></div>
        <div class="ccountry">${ch.country}</div>
        <div class="cpower">${ch.special}</div>
      </div><div class="sel-badge"></div>`;
    card.addEventListener('click', () => pickCharacter(ch.id));
    roster.appendChild(card);
    rosterCards.push(card);
    paintPortrait(card.querySelector('canvas'), ch, idx, 'card');
  });
}
function pickCharacter(id) {
  const s = G.sel;
  if (s.active === 0) s.p1 = id; else s.p2 = id;
  s.active = s.active === 0 ? 1 : 0;
  if (s.active === 0 && !s.p1) s.active = 0;
  refreshSelectionUI();
  audio.ui();
  const ch = CHAR_BY_ID[id];
  if (ch) floatText(rand(150, W - 150), rand(200, 420), ch.name + '!', ch.c1, 24);
}
function randomizePick() {
  const s = G.sel;
  if (!s.p1) s.p1 = choose(CHARS).id;
  else if (!s.p2) s.p2 = choose(CHARS).id;
  else { s.p1 = choose(CHARS).id; s.p2 = choose(CHARS.filter(c => c.id !== s.p1)).id; }
  refreshSelectionUI();
  audio.ui();
}

function goStageSelect() {
  if (!G.sel.p1 || !G.sel.p2) return;
  showScreen('stage');
  audio.ui();
}

function prepareMatch(stageId) {
  G.stage = stageId;
  const p1 = makeFighter(G.sel.p1, 0, 350, false);
  const p2 = makeFighter(G.sel.p2, 1, 930, G.mode === 'cpu');
  G.players = [p1, p2];
  G.round = 1; G.wins = [0, 0]; G.matchWinner = -1; G.roundState = 'idle'; G.roundReason = '';
  G.stats = { hits: 0, specials: 0, supers: 0 };
  G.projectiles.length = 0; G.hazards.length = 0; G.particles.length = 0; G.rings.length = 0; G.slashes.length = 0; G.floaters.length = 0;
  G.blackout = 0; G.superFlash = 0;
  // VS presentation
  const c1 = p1.char, c2 = p2.char;
  ui.vsFace1.width = 360; ui.vsFace1.height = 400; ui.vsFace2.width = 360; ui.vsFace2.height = 400;
  paintPortrait(ui.vsFace1, c1, 2, 'large'); paintPortrait(ui.vsFace2, c2, 4, 'large');
  ui.vsName1.textContent = c1.name; ui.vsName2.textContent = c2.name;
  ui.vsCountry1.textContent = c1.country; ui.vsCountry2.textContent = c2.country;
  ui.vsStage.textContent = STAGES.find(s => s.id === stageId).name;
  G.vsT = 0;
  showScreen('vs');
  audio.special();
}
function beginFight() {
  if (!G.players.length) return;
  G.vsT = 0;
  showScreen('fight');
  ui.hud.classList.remove('hidden');
  G.round = 1; G.wins = [0, 0]; G.matchWinner = -1;
  G.players[0].wins = 0; G.players[1].wins = 0;
  startRound(true);
  updateHUD();
}
function startRound(resetPositions = true) {
  const p1 = G.players[0], p2 = G.players[1];
  if (!p1 || !p2) return;
  [p1, p2].forEach((f, i) => {
    f.hp = f.maxHp; f.meter = 30; f.state = 'idle'; f.attack = null; f.attackT = 0;
    f.hitstun = 0; f.blockstun = 0; f.stun = 0; f.invuln = 0; f.flash = 0; f.aura = 0;
    f.cooldown = 0; f.koT = 0; f.combo = 0; f.comboT = 0; f.vx = 0; f.vy = 0;
    f.grounded = true; f.y = FLOOR; f.wins = G.wins[i]; f.trail.length = 0;
    if (resetPositions) { f.x = i === 0 ? 350 : 930; f.facing = i === 0 ? 1 : -1; }
  });
  G.timer = 60; G.roundState = 'intro'; G.roundT = 0; G.introStep = 0;
  G.projectiles.length = 0; G.hazards.length = 0; G.particles.length = 0; G.rings.length = 0; G.slashes.length = 0; G.floaters.length = 0;
  G.hitstop = 0; G.slowT = 0; G.shake = 0; G.flash = 0; G.superFlash = 0; G.blackout = 0;
  const st = STAGES.find(s => s.id === G.stage);
  announce('ROUND ' + G.round, st ? st.where : '', 1.05);
  updateHUD();
  audio.crowd(1.4);
}

function concludeRound(reason) {
  if (G.roundState === 'concluded') return;
  const [p1, p2] = G.players;
  let winner = -1;
  if (p1.hp <= 0 && p2.hp > 0) winner = 1;
  else if (p2.hp <= 0 && p1.hp > 0) winner = 0;
  else if (p1.hp > 0 && p2.hp > 0) {
    if (p1.hp > p2.hp) winner = 0; else if (p2.hp > p1.hp) winner = 1;
  }
  G.roundReason = reason || G.roundReason;
  if (winner >= 0) {
    G.wins[winner]++;
    G.players[winner].wins = G.wins[winner];
    G.players[winner].state = 'win';
    G.players[winner].attack = null;
    G.matchWinner = G.wins[winner] >= 2 ? winner : -1;
    const nm = winner === 0 ? (G.mode === 'cpu' ? 'YOU WIN' : 'PLAYER 1 WINS') : (G.mode === 'cpu' ? 'CPU WINS' : 'PLAYER 2 WINS');
    const perfect = G.players[winner].hp >= G.players[winner].maxHp - 1;
    announce(nm, perfect ? 'PERFECT!' : G.roundReason || 'ROUND WON', 2.4);
  } else {
    G.matchWinner = -1;
    announce('DRAW', 'REPLAY THE ROUND', 2.2);
  }
  G.roundState = 'concluded'; G.concludeT = 0;
  updateHUD();
}
function updateFight(dt) {
  const raw = dt * 60;
  updateParticles(raw);
  if (G.paused) return;
  const dtf = raw * (G.slowT > 0 ? .35 : 1);
  if (G.slowT > 0) G.slowT = Math.max(0, G.slowT - dt);
  const fighters = G.players;
  if (G.roundState === 'intro') {
    G.roundT += dt;
    for (const f of fighters) updateFighter(f, raw, true);
    if (G.roundT > 1.15 && G.introStep === 0) {
      G.introStep = 1;
      announce('FIGHT!', G.players[0].char.name + ' VS ' + G.players[1].char.name, .95);
      audio.crowd(2.2);
    }
    if (G.roundT > 1.75) G.roundState = 'fight';
  } else if (G.roundState === 'fight') {
    if (G.hitstop > 0) { G.hitstop -= raw; }
    else {
      G.timer -= dt;
      for (const f of fighters) updateFighter(f, dtf);
      updateProjectiles(dtf);
      updateHazards(dtf);
      // gentle body separation
      const [a, b] = fighters;
      const d = b.x - a.x, ad = Math.abs(d), min = 116;
      if (ad < min && Math.abs(a.y - b.y) < 60) {
        const push = (min - ad) / 2 * sign(d || 1);
        a.x -= push; b.x += push;
        a.x = clamp(a.x, 74, W - 74); b.x = clamp(b.x, 74, W - 74);
      }
      if (G.timer <= 0) {
        G.timer = 0; G.roundState = 'timeup'; G.roundT = 0;
        announce('TIME UP', 'THE CLOCK IS UNDEFEATED', 1.4);
        audio.crowd(1.8);
      }
    }
  } else if (G.roundState === 'ko') {
    G.roundT += dt;
    if (G.hitstop > 0) G.hitstop -= raw;
    else {
      for (const f of fighters) updateFighter(f, dtf);
      updateProjectiles(dtf); updateHazards(dtf);
    }
    if (G.roundT > 2.65) concludeRound('K.O.');
  } else if (G.roundState === 'timeup') {
    G.roundT += dt;
    for (const f of fighters) updateFighter(f, raw, true);
    updateHazards(raw);
    if (G.roundT > 1.25) concludeRound('TIME UP');
  } else if (G.roundState === 'concluded') {
    G.concludeT += dt;
    for (const f of fighters) updateFighter(f, raw, true);
    updateHazards(raw);
    if (G.concludeT > 2.15) {
      if (G.matchWinner >= 0) showResults();
      else { G.round++; startRound(true); }
    }
  }
  // combo decay UI
  updateHUD();
}

function showResults() {
  const wi = G.matchWinner;
  const win = G.players[wi];
  if (!win) return showScreen('title');
  ui.resultFace.width = 340; ui.resultFace.height = 400;
  paintPortrait(ui.resultFace, win.char, 3, 'large');
  if (G.mode === 'cpu') ui.resultTitle.textContent = wi === 0 ? 'YOU WIN' : 'CPU WINS';
  else ui.resultTitle.textContent = wi === 0 ? 'PLAYER 1 WINS' : 'PLAYER 2 WINS';
  const st = STAGES.find(s => s.id === G.stage);
  ui.resultSub.textContent = `${win.char.country} TAKES ${st.name} · ${G.wins[0]} — ${G.wins[1]}`;
  ui.resultQuote.textContent = win.char.quote;
  showScreen('results');
  ui.hud.classList.add('hidden');
  audio.crowd(2.4);
  // confetti
  for (let i = 0; i < 90; i++) G.particles.push({
    x: rand(0, W), y: rand(-200, 100), vx: rand(-1, 1), vy: rand(1, 3.5),
    life: rand(80, 160), maxLife: 160, size: rand(3, 7), color: choose([win.char.c1, win.char.c2, '#e9ff35', '#ff2e7a', '#fff']),
    gravity: .015, type: Math.random() < .5 ? 'confetti' : 'star', rot: rand(0, TAU), vr: rand(-.15, .15)
  });
}

function rematch() {
  if (!G.players.length) return;
  G.wins = [0, 0]; G.round = 1; G.matchWinner = -1;
  G.players[0].wins = 0; G.players[1].wins = 0;
  G.projectiles.length = 0; G.hazards.length = 0; G.particles.length = 0; G.floaters.length = 0;
  showScreen('fight');
  ui.hud.classList.remove('hidden');
  startRound(true);
}

function togglePause() {
  if (G.screen !== 'fight') return;
  G.paused = !G.paused;
  ui.pause.classList.toggle('hidden', !G.paused);
  updateTouchVisibility();
  updatePauseBtn();
  audio.ui();
  if (G.paused) ui.pause.classList.remove('hidden');
}

function handleEnter() {
  if (G.screen === 'title') { openSelect('cpu'); return; }
  if (G.screen === 'howto') { showScreen('title'); return; }
  if (G.screen === 'vs') { beginFight(); return; }
  if (G.screen === 'results') { rematch(); return; }
  if (G.screen === 'select' && G.sel.p1 && G.sel.p2) { goStageSelect(); return; }
  if (G.screen === 'fight' && G.paused) { togglePause(); return; }
}

/* ============================ HUD ============================ */
let hudCache = {};
function updateHUD() {
  const p1 = G.players[0], p2 = G.players[1];
  if (!p1 || !p2) return;
  if (hudCache.n1 !== p1.char.name) {
    ui.name1.textContent = p1.char.name; ui.name2.textContent = p2.char.name;
    ui.flag1.textContent = p1.char.flag; ui.flag2.textContent = p2.char.flag;
    ui.tag1.textContent = 'P1'; ui.tag2.textContent = G.mode === 'cpu' ? 'CPU' : 'P2';
    ui.superName1.textContent = p1.char.super; ui.superName2.textContent = p2.char.super;
    hudCache.n1 = p1.char.name;
  }
  ui.stageTag.textContent = STAGES.find(s => s.id === G.stage)?.name || '';
  const h1 = clamp(p1.hp / p1.maxHp * 100, 0, 100), h2 = clamp(p2.hp / p2.maxHp * 100, 0, 100);
  if (hudCache.h1 !== h1) { ui.hp1.style.width = h1 + '%'; ui.ghost1.style.width = h1 + '%'; hudCache.h1 = h1; }
  if (hudCache.h2 !== h2) { ui.hp2.style.width = h2 + '%'; ui.ghost2.style.width = h2 + '%'; hudCache.h2 = h2; }
  ui.hp1.parentElement.classList.toggle('low', h1 < 25);
  ui.hp2.parentElement.classList.toggle('low', h2 < 25);
  const m1 = clamp(p1.meter, 0, 100), m2 = clamp(p2.meter, 0, 100);
  ui.meter1.style.width = m1 + '%'; ui.meter2.style.width = m2 + '%';
  ui.meter1.parentElement.parentElement.classList.toggle('full', m1 >= 100);
  ui.meter2.parentElement.parentElement.classList.toggle('full', m2 >= 100);
  ui.timer.textContent = String(Math.ceil(G.timer)).padStart(2, '0');
  ui.roundTag.textContent = 'ROUND ' + G.round;
  const pips1 = ui.pips1.children, pips2 = ui.pips2.children;
  for (let i = 0; i < 2; i++) {
    pips1[i].classList.toggle('won', G.wins[0] > i);
    pips2[i].classList.toggle('won', G.wins[1] > i);
  }
  // combo UI
  for (let i = 0; i < 2; i++) {
    const f = G.players[i], el = i === 0 ? ui.combo1 : ui.combo2;
    if (f.combo >= 2 && f.comboT > 0 && f.hp > 0) {
      el.classList.add('show');
      el.innerHTML = `<b>${f.combo}</b><span>HIT COMBO</span>`;
    } else el.classList.remove('show');
  }
  if (isTouch) {
    const sb = document.querySelector('.act.act-super');
    if (sb) sb.classList.toggle('ready', p1.meter >= 100);
  }
}

/* ============================ RENDER ============================ */
function drawStageCore(t, stageId, shake = 0) {
  const sx = G.shakeX, sy = G.shakeY;
  ctx.save();
  ctx.translate(sx, sy);
  ctx.scale(1.035, 1.035);
  ctx.translate(-W * .0175, -H * .0175);
  ctx.drawImage(stageBases[stageId], 0, 0);
  drawStageDynamic(ctx, stageId, t);
  ctx.restore();
}
function drawSpotlights(t, title = false) {
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const beams = title ? [[180, .12, '#ff9a3c'], [520, .1, '#20e6ff'], [980, .12, '#ff2e7a'], [1220, .08, '#e9ff35']] : [[220, .05, '#e9ff35'], [1060, .05, '#ff2e7a']];
  for (let i = 0; i < beams.length; i++) {
    const [x, a, col] = beams[i];
    const sway = Math.sin(t * .6 + i * 2) * 34;
    const grd = ctx.createLinearGradient(x, -40, W * .5, FLOOR);
    grd.addColorStop(0, col + 'aa'); grd.addColorStop(.5, col + '22'); grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd; ctx.globalAlpha = a;
    ctx.beginPath(); ctx.moveTo(x - 8, -40); ctx.lineTo(x + 8, -40); ctx.lineTo(W * .62 + sway + 160, FLOOR + 40); ctx.lineTo(W * .62 + sway - 160, FLOOR + 40); ctx.closePath(); ctx.fill();
  }
  // floor glow
  const fg = ctx.createRadialGradient(W * .5, FLOOR, 10, W * .5, FLOOR, 420);
  fg.addColorStop(0, 'rgba(255,210,140,.14)'); fg.addColorStop(1, 'rgba(255,210,140,0)');
  ctx.fillStyle = fg; ctx.beginPath(); ctx.ellipse(W * .5, FLOOR, 460, 70, 0, 0, TAU); ctx.fill();
  ctx.restore();
}
function setAttractPose(t) {
  if (!G.attract) return;
  const [a, b] = G.attract;
  a.state = 'idle'; b.state = 'idle';
  const cycle = t % 7;
  if (cycle < .55) {
    a.state = 'attack'; a.attack = { kind: 'light', startup: 4, active: 3, recovery: 8, total: 15 }; a.attackT = cycle / .55 * 15;
  } else if (cycle > 3.2 && cycle < 3.8) {
    b.state = 'attack'; b.attack = { kind: 'heavy', startup: 9, active: 5, recovery: 15, total: 29 }; b.attackT = (cycle - 3.2) / .6 * 29;
  } else if (cycle > 5 && cycle < 5.5) {
    a.state = 'block'; b.state = 'block';
  } else {
    a.walkPhase = t * .8; b.walkPhase = t * .8;
    if (Math.sin(t * .9) > .7) a.state = 'walk';
    if (Math.sin(t * 1.1 + 2) > .72) b.state = 'walk';
  }
}
function drawAttractScene(t) {
  const stageId = G.attractStage;
  drawStageCore(t, stageId);
  drawSpotlights(t, true);
  if (G.attract) {
    setAttractPose(t);
    // floor rings
    for (const f of G.attract) {
      ctx.strokeStyle = f.char.c1 + '33'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(f.x, FLOOR + 6, 80, 16, 0, 0, TAU); ctx.stroke();
      drawFighter(ctx, f, t + f.index * 1.3, {});
    }
  }
  // floating hype particles
  ctx.save();
  for (let i = 0; i < 14; i++) {
    const a = (t * .3 + i * .7) % 1;
    const x = (i * 197 + Math.sin(t + i) * 30) % W;
    const y = H - a * H;
    ctx.globalAlpha = (1 - a) * .5; ctx.fillStyle = i % 3 ? '#e9ff35' : '#ff2e7a';
    ctx.fillRect(x, y, 3, 9);
  }
  ctx.restore();
}
function drawMenuBackdrop(t) {
  drawStageCore(t, G.stage, 0);
  ctx.save(); ctx.fillStyle = 'rgba(5,5,8,.62)'; ctx.fillRect(0, 0, W, H); ctx.restore();
  drawSpotlights(t, false);
  // diagonal graphic slabs
  ctx.save(); ctx.globalAlpha = .08;
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i % 2 ? '#ff2e7a' : '#20e6ff';
    ctx.beginPath(); ctx.moveTo(-200 + i * 280, H); ctx.lineTo(-20 + i * 280, H); ctx.lineTo(120 + i * 280, 0); ctx.lineTo(-60 + i * 280, 0); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}
function drawFightBackground(t) {
  drawStageCore(t, G.stage);
  // hazard ground effects first
  drawHazards(ctx);
  // trails
  for (const f of G.players) {
    for (const tr of f.trail) {
      ctx.save(); ctx.globalAlpha = clamp(tr.life / 12, 0, 1) * .35;
      ctx.fillStyle = f.char.glow;
      ctx.beginPath(); ctx.ellipse(tr.x, FLOOR - 105, 35, 100, 0, 0, TAU); ctx.fill(); ctx.restore();
    }
  }
  // fighters
  const markers = ['#e9ff35', '#ff2e7a'];
  G.players.forEach((f, i) => {
    drawFighter(ctx, f, t, { marker: markers[i], label: i === 0 ? 'P1' : (G.mode === 'cpu' ? 'CPU' : 'P2') });
  });
  drawProjectiles(ctx);
  drawParticles(ctx);
  drawBlackout(t);
  drawSuperFlash(t);
}
function drawBlackout(t) {
  if (G.blackout <= 0) return;
  const a = clamp(G.blackout, 0, 1);
  ctx.save();
  ctx.fillStyle = `rgba(2,3,12,${.58 * a})`; ctx.fillRect(-20, -20, W + 40, H + 40);
  ctx.globalCompositeOperation = 'lighter';
  for (const f of G.players) {
    const gr = ctx.createRadialGradient(f.x, f.y - 110, 10, f.x, f.y - 110, 240);
    gr.addColorStop(0, 'rgba(255,220,120,.22)'); gr.addColorStop(1, 'rgba(255,220,120,0)');
    ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(f.x, f.y - 110, 240, 0, TAU); ctx.fill();
  }
  ctx.restore();
}
function drawSuperFlash(t) {
  if (G.superFlash <= 0) return;
  const a = clamp(G.superFlash / 32, 0, 1);
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.globalAlpha = a * .8;
  ctx.translate(W / 2, H / 2);
  ctx.rotate(t * .2);
  for (let i = 0; i < 26; i++) {
    const ang = i / 26 * TAU;
    const w = i % 2 ? .012 : .03;
    ctx.fillStyle = i % 3 ? G.superColor : '#ffffff';
    ctx.beginPath();
    ctx.moveTo(Math.cos(ang - w) * 200, Math.sin(ang - w) * 200);
    ctx.lineTo(Math.cos(ang + w) * 900, Math.sin(ang + w) * 900);
    ctx.lineTo(Math.cos(ang + w * 2.6) * 900, Math.sin(ang + w * 2.6) * 900);
    ctx.lineTo(Math.cos(ang + w * 1.4) * 200, Math.sin(ang + w * 1.4) * 200);
    ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}
function drawScreenFlash() {
  if (G.flash <= 0) return;
  const a = clamp(G.flash / 16, 0, 1);
  ctx.save(); ctx.fillStyle = `rgba(${G.flashColor},${a * .6})`; ctx.fillRect(0, 0, W, H); ctx.restore();
}
function render(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, W, H);
  if (G.screen === 'title') {
    drawAttractScene(t);
    drawScreenFlash();
  } else if (G.screen === 'select' || G.screen === 'stage' || G.screen === 'howto') {
    drawMenuBackdrop(t);
    drawScreenFlash();
  } else if (G.screen === 'vs') {
    drawStageCore(t, G.stage);
    drawFightBackground(t);
    ctx.save(); ctx.fillStyle = 'rgba(5,5,8,.35)'; ctx.fillRect(0, 0, W, H); ctx.restore();
    drawScreenFlash();
  } else if (G.screen === 'fight' || G.screen === 'results') {
    drawFightBackground(t);
    drawScreenFlash();
    if (G.screen === 'results') { ctx.save(); ctx.fillStyle = 'rgba(5,5,8,.35)'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  } else {
    drawAttractScene(t);
  }
}

/* ============================ GLOBAL UPDATE ============================ */
function updateGlobalEffects(dt) {
  const raw = dt * 60;
  if (G.shake > 0) {
    G.shake = Math.max(0, G.shake - raw * .55);
    G.shakeX = rand(-1, 1) * G.shake;
    G.shakeY = rand(-1, 1) * G.shake;
  } else { G.shakeX = 0; G.shakeY = 0; }
  if (G.flash > 0) G.flash = Math.max(0, G.flash - raw);
  if (G.superFlash > 0) G.superFlash = Math.max(0, G.superFlash - raw);
  if (G.blackout > 0) G.blackout = Math.max(0, G.blackout - dt);
  if (G.screen === 'title') { G.attractT += dt; }
  if (G.screen === 'select' && G.time - lastPortraitPaint > .075) paintSelectionPortraits(G.time);
}
function loop(now) {
  const dt = Math.min(.05, (now - (G.last || now)) / 1000);
  G.last = now;
  G.time += dt;
  updateAnnouncements(dt);
  updateGlobalEffects(dt);
  if (G.screen === 'vs') {
    G.vsT += dt;
    if (G.vsT > 2.35) beginFight();
  }
  if (G.screen === 'fight') {
    if (!G.paused) updateFight(dt);
    updateHUD();
  }
  render(G.time);
  clearInputEdges();
  requestAnimationFrame(loop);
}

/* ============================ UI BINDINGS ============================ */
function bindUI() {
  document.querySelectorAll('.title-menu [data-mode]').forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      if (mode === 'howto') { showHowto(); return; }
      openSelect(mode);
    });
  });
  ui.backToTitle.addEventListener('click', () => { showScreen('title'); refreshAttract(); audio.ui(); });
  ui.randomBtn.addEventListener('click', randomizePick);
  ui.startFightBtn.addEventListener('click', goStageSelect);
  ui.backToSelect.addEventListener('click', () => { refreshSelectionUI(); showScreen('select'); audio.ui(); });
  document.querySelectorAll('.stage-card').forEach(card => {
    card.addEventListener('click', () => { prepareMatch(card.dataset.stage); audio.ui(); });
  });
  ui.vsScreen.addEventListener('click', () => { if (G.screen === 'vs') beginFight(); });
  ui.rematchBtn.addEventListener('click', () => { audio.ui(); rematch(); });
  ui.resultSelectBtn.addEventListener('click', () => { refreshSelectionUI(); showScreen('select'); audio.ui(); });
  ui.resultTitleBtn.addEventListener('click', () => { showScreen('title'); refreshAttract(); audio.ui(); });
  ui.resumeBtn.addEventListener('click', togglePause);
  ui.restartBtn.addEventListener('click', () => { ui.pause.classList.add('hidden'); G.paused = false; updateTouchVisibility(); updatePauseBtn(); rematch(); });
  ui.quitBtn.addEventListener('click', () => { ui.pause.classList.add('hidden'); G.paused = false; showScreen('title'); refreshAttract(); audio.ui(); });
  ui.muteBtn.addEventListener('click', () => { audio.init(); audio.toggle(); });
  ui.pauseBtn.addEventListener('click', togglePause);
  document.querySelectorAll('[data-howto]').forEach(el => el.addEventListener('click', showHowto));
  const closeHowto = $('closeHowto'), howtoOk = $('howtoOk');
  if (closeHowto) closeHowto.addEventListener('click', () => showScreen('title'));
  if (howtoOk) howtoOk.addEventListener('click', () => showScreen('title'));
  window.addEventListener('keydown', e => {
    if (e.code === 'Escape') {
      if (G.screen === 'select') { showScreen('title'); refreshAttract(); }
      else if (G.screen === 'stage') { showScreen('select'); }
      else if (G.screen === 'results') { showScreen('title'); refreshAttract(); }
      else if (G.screen === 'howto') { showScreen('title'); }
      else if (G.screen === 'vs') { beginFight(); }
    }
  });
}
function showHowto() {
  showScreen('howto');
  audio.ui();
}

/* ============================ INIT ============================ */
function init() {
  cacheUI();
  faultsInit();
  initCrowdAndWeather();
  buildRoster();
  refreshAttract();
  bindUI();
  showScreen('title');
  ui.hud.classList.add('hidden');
  updatePauseBtn();
  updateTouchVisibility();
  requestAnimationFrame(loop);
}

/* small late patches */
const _origUpdateFighter = updateFighter;
updateFighter = function (f, dtf, locked = false) {
  if (f.state === 'win') {
    f.x += f.vx * dtf; f.vx *= .9;
    f.facing = f.facing || 1;
    return;
  }
  _origUpdateFighter(f, dtf, locked);
};

// boomerang correction
const _origUpdateProjectiles = updateProjectiles;
updateProjectiles = function (dtf) {
  for (const p of G.projectiles) {
    if (p.boomerang && !p.returned && p.life < p.maxLife * .55) {
      p.returned = true; p.vx = -p.origVx;
    }
    if (p.boomerang && p.origVx === undefined) { p.origVx = p.vx; }
  }
  _origUpdateProjectiles(dtf);
};

// keep confetti alive on results screen
const _origLoop = loop;
loop = function (now) {
  const dt = Math.min(.05, (now - (G.last || now)) / 1000);
  G.last = now;
  G.time += dt;
  updateAnnouncements(dt);
  updateGlobalEffects(dt);
  if (G.screen === 'vs') {
    G.vsT += dt;
    if (G.vsT > 2.35) beginFight();
  }
  if (G.screen === 'fight') {
    if (!G.paused) updateFight(dt);
    updateHUD();
  } else if (G.screen === 'results') {
    updateParticles(dt * 60);
  }
  render(G.time);
  clearInputEdges();
  requestAnimationFrame(loop);
};

init();
