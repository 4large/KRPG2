import { drawTitle } from "./title.js";
import { createGameListener, drawPlaying, poor, notPoor } from "./playing.js";
import { drawBlackJack, makeGame, playGame, resetGame } from "./blackjack.js";
import { drawStore, storeOptions } from "./store.js";
import { Kevin } from "./kevin.js";

window.addEventListener("load", () => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  //Variables
  canvas.width = 1200;
  canvas.height = 700;

  const gameState = {
    TITLE: 'title',
    PLAYING: 'playing',
    BLACKJACK: 'blackjack',
    STORE: 'store'
  };
  let state = gameState.TITLE;
  let playingBJ = false;

  const kevin = new Kevin();

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
      case gameState.STORE:
        drawStore(ctx, canvas);
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
  document.addEventListener('blackjack', (event) => {
    makeGame(event.detail.wager);
    state = gameState.BLACKJACK;
    playingBJ = false
  });
  document.addEventListener('piss', () => {
    playingBJ = true;
  });
  document.addEventListener('done-gambling', (e) => {
    state = gameState.PLAYING;

    const balancestr = document.getElementById('feet').textContent;
    const balancereg = balancestr.match(/(\d+)/);
    const balance = Number(balancereg[0]);

    const casino = e.detail.myVar;

    resetGame();
    if (balance < 5) {
      poor();
    } else {
      notPoor(casino);
    }
  });
  document.addEventListener('store', () => {
    document.getElementById('dialogue-box').textContent = 'Welcome to Little Saint James Casino and Resorts Store plus Crack Den, now with a K-Mart! What can I get ya today?';
    state = gameState.STORE;
    storeOptions();
  });
  document.addEventListener('item-purchased', (e) => {
    const name = e.detail.name;
    kevin.applyStatChange(name);
  });

  function loop(timestamp) {
    if (state === gameState.BLACKJACK && !playingBJ) {
      playGame();
    }

    draw(timestamp);

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
});
