import { drawTitle } from "./title.js";
import { drawPlaying, updatePlaying } from "./playing.js";

window.addEventListener("load", (event) => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  //Variables
  canvas.width = 1200;
  canvas.height = 700;

  const gameState = {
    TITLE: 'title',
    PLAYING: 'playing'
  };
  let state = gameState.TITLE;

  // ── Update ─────────────────────────────────────
  function update(dt) {
    switch (state) {
      case gameState.TITLE:
        break;
      case gameState.PLAYING:
        updatePlaying();
        break;
    }
  }

  // ── Draw ───────────────────────────────────────
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    switch (state) {
      case gameState.TITLE:
        drawTitle(ctx, canvas);
        break;
      case gameState.PLAYING:
        drawPlaying(ctx);
        break;
    }
  }

  // ── Loop ───────────────────────────────────────
  let lastTime = 0;
  document.addEventListener('buttonPressed', (e) => {
    state = gameState.PLAYING;
  });

  function loop(timestamp) {
    const dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    update(dt);
    draw();

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
});