const ball = document.getElementById('ball');

let x = window.innerWidth * 0.5;
let y = window.innerHeight * 0.3;
let dx = 3;
let dy = 2.5;

function animate() {
  const bw = ball.offsetWidth;
  const bh = ball.offsetHeight;

  x += dx;
  y += dy;

  if (x <= 0)                        { x = 0;                         dx = Math.abs(dx); }
  if (x + bw >= window.innerWidth)   { x = window.innerWidth - bw;    dx = -Math.abs(dx); }
  if (y <= 0)                        { y = 0;                         dy = Math.abs(dy); }
  if (y + bh >= window.innerHeight)  { y = window.innerHeight - bh;   dy = -Math.abs(dy); }

  ball.style.left = x + 'px';
  ball.style.top  = y + 'px';

  requestAnimationFrame(animate);
}

animate();