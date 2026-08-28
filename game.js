import { drawTitle } from "./title.js";
import { createGameListener, drawPlaying, poor, notPoor, theSniff } from "./playing.js";
import { drawBlackJack, makeGame, playGame, resetGame } from "./blackjack.js";
import { drawStore, storeOptions } from "./store.js";
import { Kevin } from "./kevin.js";

export const kevin = new Kevin();

function showEula() {
  return new Promise((resolve) => {
    const modal = document.createElement('div');
    modal.id = 'eula-modal';
    modal.innerHTML = `
      <div style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:9999; display:flex; justify-content:center; align-items:flex-start; padding-top:100px;">
        <div style="background:#1a1a1a; color:#fff; padding:40px; border-radius:10px; max-width:500px; text-align:center; border:2px solid #444; font-family:sans-serif; line-height:1.6;">
          <h2 style="margin-top:0; margin-bottom:20px;">End User License Agreement</h2>
          <p style="margin-bottom:15px;">By playing Kevin RPG 2, you agree to the terms and conditions outlined <a href="eula.html" target="_blank" style="color:#4fc3f7;">here</a></p>
          <button id="accept-eula" style="padding:12px 30px; font-size:16px; cursor:pointer; background:#4fc3f7; border:none; border-radius:4px; color:#000; font-weight:bold;">Yes daddy 😍</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('accept-eula').onclick = () => {
      localStorage.setItem('eulaAccepted', 'true');
      modal.remove();
      resolve();
    };
  });
}

async function initGame() {
  if (!localStorage.getItem('eulaAccepted')) {
    await showEula();
    alert('Heyyyyyy\n\nSo most browsers will disable audio by default because they are HATERS of KRPG2. For the \
    best experience of KRPG2, we recommend turning on audio permissions for this page. Our music dude and voice dude \
    gave a strictly medium effort into producing the audio for this game and it would mean certainly something if you enabled audio. \
    plus, can you really say you beat KRPG2 if audio isn\'t enabled?');
  }

  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  canvas.width = 1200;
  canvas.height = 700;

  const gameState = {
    TITLE: 'title',
    PLAYING: 'playing',
    BLACKJACK: 'blackjack',
    STORE: 'store',
    CREDITS: 'credits'
  };
  let state = gameState.TITLE;
  let playingBJ = false;
  let credits = false;

  const music = new Audio('assets/KRPG2 OFFICIAL SOUNDTRACK DELUXE 1/Title Theme.mp3');
  music.volume = .25;

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

  document.addEventListener('buttonPressed', () => {
    state = gameState.PLAYING;
    document.getElementById('dialogue-box').style.opacity = 1;
    setAudio('Init');
    let clickoverlay = createGameListener();
  });
  document.addEventListener('blackjack', (event) => {
    makeGame(event.detail.wager);
    state = gameState.BLACKJACK;
    playingBJ = false;
    setAudio('Blackjack');
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

    setAudio('Init');

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
    setAudio('Store');
    storeOptions();
  });
  document.addEventListener('item-purchased', (e) => {
    const name = e.detail.name;
    kevin.printStatSheet();
    kevin.applyStatChange(name);
    kevin.printStatSheet();
  });
  document.addEventListener('netanyahu', () => {
    state = gameState.PLAYING;
    setAudio('Sniff');
    resetGame();
    theSniff();
  });
  document.addEventListener('credits', () => {
    state = gameState.CREDITS;
    credits = true;
    loadCredits();
  });
  document.addEventListener('audio', (e) => {
    const name = e.detail.music;
    setAudio(name);
  });
  music.addEventListener('canplaythrough', () => {
    music.loop = true;
    music.play();
  });

  async function loadCredits() {
    const creditsDOM = document.getElementById('credits');
    const contentDOM = document.getElementById('credits-content');

    try {
      const response = await fetch('CREDITS.txt');
      const text = await response.text();

      contentDOM.innerHTML = text.split('\n').map(line =>
        line.trim() ? `<p>${line}</p>` : '<br>'
      ).join('');

    } catch (err) {
      console.log(`Error, could not load credits: ${err}`);
      contentDOM.innerHTML = '<p>FUCK!</p>';
    }

    creditsDOM.style.display = 'block';
  }

  function setAudio(audioSrc) {
    const fullSrc = `assets/KRPG2 OFFICIAL SOUNDTRACK DELUXE 1/${audioSrc} Theme.mp3`;
    if (fullSrc === 'assets/KRPG2 OFFICIAL SOUNDTRACK DELUXE 1/Combat Theme.mp3' || fullSrc === 'assets/KRPG2 OFFICIAL SOUNDTRACK DELUXE 1/Drunk Theme.mp3') {
      music.volume = 1;
    } else {
      music.volume = .25;
    }
    const resolvedSrc = new URL(fullSrc, location.href).href;

    if (music.src !== resolvedSrc) {
      music.src = fullSrc;
    }
  }

  function loop(timestamp) {
    if (state === gameState.BLACKJACK && !playingBJ) {
      playGame();
    }
    if (credits) {
      return;
    }

    draw(timestamp);
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

window.addEventListener("load", initGame);