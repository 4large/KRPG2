import { drawTitle } from "./title.js";
import { createGameListener, drawPlaying } from "./playing.js";
import { drawBlackJack, makeGame } from "./blackjack.js";

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

  // ── Draw ───────────────────────────────────────
  //This is horribly optimized, change when you have more progress made.
  function draw(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    switch (state) {
      case gameState.TITLE:
        drawTitle(ctx, canvas);
        break;
      case gameState.PLAYING:
        drawPlaying(ctx, canvas);
        break;
      case gameState.BLACKJACK:
        drawBlackJack(ctx, canvas, time);
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
    makeGame();
    state = gameState.BLACKJACK;
  });

  function loop(timestamp) {
    draw(timestamp);

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
});
