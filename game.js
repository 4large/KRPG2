import { drawTitle } from "./title.js";
import { createGameListener, drawPlaying } from "./playing.js";
import { drawBlackJack } from "./blackjack.js";

window.addEventListener("load", () => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  //Variables
  canvas.width = 1200;
  canvas.height = 700;

  const gameState = {
    TITLE: 'title',
    PLAYING: 'playing',
    BLACKJACK: 'blackjack'
  };
  let state = gameState.TITLE;

  // ── Update ─────────────────────────────────────
  //May not be necessary but use it if it is (prolly necessary for animation, refactor out if unnecessary)
  function update() {
    switch (state) {
      case gameState.TITLE:
        break;
      case gameState.PLAYING:
        break;
    }
  }

  // ── Draw ───────────────────────────────────────
  //This is horribly optimized, change when you have more progress made.
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    switch (state) {
      case gameState.TITLE:
        drawTitle(ctx, canvas);
        break;
      case gameState.PLAYING:
        drawPlaying(ctx, canvas);
        break;
      case gameState.BLACKJACK:
        drawBlackJack(ctx, canvas);
        break;
    }
  }

  // ── Loop ───────────────────────────────────────
  document.addEventListener('buttonPressed', () => {
    state = gameState.PLAYING;
    document.getElementById('dialogue-box').style.opacity = 1;
    //Handles clicks over the canvas screeen, im returning it incase we need to do something like disable the listener for events
    //that require another input or smth.
    let clickoverlay = createGameListener();
  });
  document.addEventListener('blackjack', () => {
    state = gameState.BLACKJACK;
  });

  function loop() {
    update();
    draw();

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
});
