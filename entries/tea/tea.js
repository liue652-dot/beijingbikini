const canvas = document.getElementById("seedCanvas");
const ctx = canvas.getContext("2d");

let W, H;
let seeds = [];
let seedImages = [];

const GRAVITY = 0.6;
const DAMPING = 0.999;
const FLOOR_BOUNCE = 0.25;
const SEED_BOUNCE = 0.2;
const SPIN_DECAY = 0.4;

const MAX_SEEDS = 400;
const SPAWN_EVERY = 8;

const BASE_W = 56;
const BASE_H = 92;

const CELL = 120;
let grid = {};


function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

function loadSeedImages() {
  const imgs = [...document.querySelectorAll(".seed-src")];
  return Promise.all(
    imgs.map(i => i.complete ? i : new Promise(r => (i.onload = () => r(i))))
  );
}

function createSeed() {
  const s = 1.1 + Math.random() * 0.6;
  return {
    imgIdx: Math.random() * seedImages.length | 0,
    w: BASE_W * s,
    h: BASE_H * s,
    r: BASE_W * s * 0.40,
    x: 80 + Math.random() * (W - 160),
    y: -120,
    vx: (Math.random() - 0.5) * 3,
    vy: 1.5 + Math.random() * 2,
    rot: Math.random() * 6.28,
    vrot: 0
  };
}

/* ---------- grid ---------- */

function buildGrid() {
  grid = {};
  for (let i = 0; i < seeds.length; i++) {
    const s = seeds[i];
    const cx = (s.x / CELL) | 0;
    const cy = (s.y / CELL) | 0;
    const key = cx + "," + cy;
    (grid[key] ||= []).push(i);
  }
}


function solveCollisions() {

  for (let step = 0; step < 3; step++) {

    buildGrid();

    for (let i = 0; i < seeds.length; i++) {

      const a = seeds[i];
      const cx = (a.x / CELL) | 0;
      const cy = (a.y / CELL) | 0;

      for (let gx = -1; gx <= 1; gx++)
      for (let gy = -1; gy <= 1; gy++) {

        const list = grid[(cx+gx)+","+(cy+gy)];
        if (!list) continue;

        for (const j of list) {

          if (j <= i) continue;

          const b = seeds[j];

          let dx = b.x - a.x;
          let dy = b.y - a.y;
          let d2 = dx*dx + dy*dy;
          let min = a.r + b.r;

          if (d2 >= min*min || d2 < 0.0001) continue;

          let d = Math.sqrt(d2);
          let nx = dx / d;
          let ny = dy / d;
          let overlap = (min - d) * 0.5;

          a.x -= nx * overlap;
          a.y -= ny * overlap;
          b.x += nx * overlap;
          b.y += ny * overlap;

          let rvx = a.vx - b.vx;
          let rvy = a.vy - b.vy;
          let vn = rvx * nx + rvy * ny;

          if (vn > 0) {
            let imp = vn * (1 + SEED_BOUNCE) * 0.5;
            a.vx -= imp * nx;
            a.vy -= imp * ny;
            b.vx += imp * nx;
            b.vy += imp * ny;
          }
        }
      }

      // floor
      if (a.y + a.r > H) {
        a.y = H - a.r;
        if (a.vy > 0) {
          a.vy *= -FLOOR_BOUNCE;
          a.vx *= 0.9;
        }
      }

      // walls
      if (a.x - a.r < 0) {
        a.x = a.r;
        a.vx = Math.abs(a.vx) * 0.4;
      }
      if (a.x + a.r > W) {
        a.x = W - a.r;
        a.vx = -Math.abs(a.vx) * 0.4;
      }
    }
  }
}


let frame = 0;

function tick() {

  ctx.clearRect(0,0,W,H);
  frame++;

  if (frame % SPAWN_EVERY === 0 && seeds.length < MAX_SEEDS) {
    seeds.push(createSeed());
  }

  for (const s of seeds) {
    s.vy += GRAVITY;
    s.vx *= DAMPING;
    s.x += s.vx;
    s.y += s.vy;
    s.vrot *= SPIN_DECAY;
    s.rot += s.vrot;
  }

  solveCollisions();

  seeds.sort((a,b)=>a.y-b.y);

  for (const s of seeds) {
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.rot);
    ctx.drawImage(seedImages[s.imgIdx], -s.w/2, -s.h/2, s.w, s.h);
    ctx.restore();
  }

  requestAnimationFrame(tick);
}

(async function init(){
  resize();
  window.addEventListener("resize", resize);
  seedImages = await loadSeedImages();
  tick();
})();