const canvas = document.getElementById('seedCanvas');
const ctx    = canvas.getContext('2d');

let W, H;
let seeds      = [];
let seedImages = [];

const GRAVITY      = 0.6;
const DAMPING      = 0.999;
const FLOOR_BOUNCE = 0.25;
const SEED_BOUNCE  = 0.30;
const MAX_SEEDS    = 400;
const BASE_W       = 56;
const BASE_H       = 92;
const SPAWN_EVERY  = 8;

const PILE_CEIL_RATIO = 0.3;

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

function loadSeedImages() {
  const imgs = Array.from(document.querySelectorAll('.seed-src'));
  return Promise.all(imgs.map(img =>
    img.complete ? img :
      new Promise(res => { img.onload = () => res(img); })
  ));
}

function createSeed() {
  const scale = 1.1 + Math.random() * 0.6;
  return {
    imgIdx: Math.floor(Math.random() * seedImages.length),
    w:    BASE_W * scale,
    h:    BASE_H * scale,
    r:    BASE_W * scale * 0.40,
    x:    80 + Math.random() * (W - 160),
    y:    -120,
    vx:   (Math.random() - 0.5) * 3,
    vy:   1.5 + Math.random() * 2,
    rot:  Math.random() * Math.PI * 2,
    vrot: 0,
  };
}

let grid = {};
const CELL = 120;

function gridKey(cx, cy) { return cx + ',' + cy; }

function buildGrid() {
  grid = {};
  for (let i = 0; i < seeds.length; i++) {
    const s  = seeds[i];
    const cx = Math.floor(s.x / CELL);
    const cy = Math.floor(s.y / CELL);
    for (let dx = -1; dx <= 1; dx++)
      for (let dy = -1; dy <= 1; dy++) {
        const k = gridKey(cx + dx, cy + dy);
        if (!grid[k]) grid[k] = [];
        grid[k].push(i);
      }
  }
}

function getNearby(s) {
  const cx = Math.floor(s.x / CELL);
  const cy = Math.floor(s.y / CELL);
  return grid[gridKey(cx, cy)] || [];
}

function solveCollisions() {
  buildGrid();

  const pileCeil = H * PILE_CEIL_RATIO;

  for (let step = 0; step < 3; step++) {
    const seen = new Set();

    for (let i = 0; i < seeds.length; i++) {
      const a      = seeds[i];
      const nearby = getNearby(a);

      for (const j of nearby) {
        if (j <= i) continue;
        const key = i * 100000 + j;
        if (seen.has(key)) continue;
        seen.add(key);

        const b  = seeds[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const d2 = dx * dx + dy * dy;
        const mn = a.r + b.r;
        if (d2 >= mn * mn || d2 < 0.0001) continue;

        const dist    = Math.sqrt(d2);
        const nx      = dx / dist;
        const ny      = dy / dist;
        const overlap = (mn - dist) * 0.5;

        a.x -= nx * overlap;
        a.y -= ny * overlap;
        b.x += nx * overlap;
        b.y += ny * overlap;

        const dvx = a.vx - b.vx;
        const dvy = a.vy - b.vy;
        const vn  = dvx * nx + dvy * ny;

        if (vn > 0) {
          const imp = vn * (1 + SEED_BOUNCE) * 0.5;
          a.vx -= imp * nx; a.vy -= imp * ny;
          b.vx += imp * nx; b.vy += imp * ny;
        }
      }

      if (a.y + a.r > H) {
        a.y = H - a.r;
        if (a.vy > 0) { a.vy *= -FLOOR_BOUNCE; a.vx *= 0.90; }
      }

      if (a.y - a.r < pileCeil) {
        a.y = pileCeil + a.r;
        if (a.vy < 0) { a.vy *= -FLOOR_BOUNCE; a.vx *= 0.90; }
      }

      if (a.x - a.r < 0)  { a.x = a.r;     a.vx =  Math.abs(a.vx) * 0.4; }
      if (a.x + a.r > W)  { a.x = W - a.r; a.vx = -Math.abs(a.vx) * 0.4; }
    }
  }
}

let frame = 0;

function tick() {
  ctx.clearRect(0, 0, W, H);
  frame++;

  if (frame % SPAWN_EVERY === 0 && seeds.length < MAX_SEEDS) {
    seeds.push(createSeed());
  }

  for (const s of seeds) {
    s.vy  += GRAVITY;
    s.vx  *= DAMPING;
    s.x   += s.vx;
    s.y   += s.vy;
    s.vrot *= 0.985;
    s.rot  += s.vrot;
  }

  solveCollisions();

  const sorted = seeds.slice().sort((a, b) => a.y - b.y);
  for (const s of sorted) {
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.rot);
    ctx.drawImage(seedImages[s.imgIdx], -s.w / 2, -s.h / 2, s.w, s.h);
    ctx.restore();
  }

  requestAnimationFrame(tick);
}

(async function init() {
  resize();
  window.addEventListener('resize', resize);
  seedImages = await loadSeedImages();
  tick();
})();