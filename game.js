import { drawTitle } from "./title.js";
import { createGameListener, drawPlaying } from "./playing.js";

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
  //May not be necessary but use it if it is (prolly necessary for animation, refactor out if unnecessary)
  function update(dt) {
    switch (state) {
      case gameState.TITLE:
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
        drawPlaying(ctx, canvas);
        break;
    }
  }

  // ── Loop ───────────────────────────────────────
  let lastTime = 0;
  document.addEventListener('buttonPressed', (e) => {
    state = gameState.PLAYING;
    document.getElementById('dialogue-box').style.opacity = 1;
    //Handles clicks over the canvas screeen, im returning it incase we need to do something like disable the listener for events
    //that require another input or smth.
    var clickoverlay = createGameListener();
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