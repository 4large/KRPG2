import { updateTitle, drawTitle } from "./title.js";

window.addEventListener("load", (event) => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  //Variables
  canvas.width = 1200;
  canvas.height = 700;

  // ── Game State ─────────────────────────────────
  const gameState = {
    TITLE: 'title',
    PLAYING: 'playing'
  };
  let state = gameState.TITLE;

  // ── Update ─────────────────────────────────────
  function update(dt) {
    switch (state) {
      case gameState.TITLE:
        updateTitle(ctx, dt);
        break;
      case gameState.PLAYING:
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
        break;
    }
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
});