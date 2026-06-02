const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

//Variables
canvas.width = 1200;
canvas.height = 700;

// ── Game State ─────────────────────────────────
// Add your game objects here

// ── Update ─────────────────────────────────────
function update(dt) {
  // Game logic here
}

// ── Draw ───────────────────────────────────────
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw your game objects here
}

// ── Loop ───────────────────────────────────────
let lastTime = 0;

function loop(timestamp) {
  const dt = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  update(dt);
  draw();

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);