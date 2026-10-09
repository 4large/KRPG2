import {
  drawBlackJack,
  makeGame,
  playGame,
  setNextWager,
  waitForBlackjackAssets,
} from './blackjack-only-engine.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const dialogue = document.getElementById('dialogue-box');
const balanceDisplay = document.getElementById('feet');
const betForm = document.getElementById('bet-form');
const betInput = document.getElementById('next-bet');
const betStatus = document.getElementById('bet-status');
const startButton = document.getElementById('start-round');

let roundStarted = false;
let playerActionsReady = false;
let stagedBet = 5;
let assetsLoaded = false;

startButton.disabled = true;
startButton.textContent = 'Loading blackjack…';

function readBalance() {
  const match = balanceDisplay.textContent.match(/(\d+)/);
  return match ? Number(match[0]) : 0;
}

function validateBet(rawValue) {
  const amount = Number(rawValue);
  const available = readBalance();
  if (!Number.isFinite(amount) || !Number.isInteger(amount)) {
    return { valid: false, message: 'Enter a whole-dollar bet.' };
  }
  if (amount < 5) {
    return { valid: false, message: 'The minimum bet is $5.' };
  }
  if (amount > available) {
    return { valid: false, message: `Your bet can't exceed your available balance of $${available}.` };
  }
  return { valid: true, amount };
}

function syncMaximumBet() {
  betInput.max = String(readBalance());
}

betForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const checked = validateBet(betInput.value);
  if (!checked.valid) {
    betStatus.textContent = checked.message;
    betStatus.dataset.state = 'error';
    return;
  }

  stagedBet = checked.amount;
  setNextWager(stagedBet);
  betStatus.textContent = `Next hand bet set to $${stagedBet}.`;
  betStatus.dataset.state = 'success';
  if (!roundStarted) dialogue.textContent = `Your first bet is $${stagedBet}. Select Start blackjack when ready.`;
});

startButton.addEventListener('click', () => {
  const checked = validateBet(betInput.value);
  if (!checked.valid) {
    betStatus.textContent = checked.message;
    betStatus.dataset.state = 'error';
    return;
  }

  stagedBet = checked.amount;
  setNextWager(stagedBet);
  makeGame(stagedBet);
  roundStarted = true;
  startButton.hidden = true;
  dialogue.style.opacity = '1';
  dialogue.textContent = '';
  betStatus.textContent = `Current hand bet: $${stagedBet}. Change the next-hand bet above whenever you like.`;
  betStatus.dataset.state = 'success';
});

document.addEventListener('piss', () => {
  playerActionsReady = true;
});

document.addEventListener('blackjack', (event) => {
  const checked = validateBet(event.detail?.wager ?? stagedBet);
  const nextBet = checked.valid ? checked.amount : stagedBet;
  stagedBet = nextBet;
  betInput.value = String(nextBet);
  setNextWager(nextBet);
  makeGame(nextBet);
  playerActionsReady = false;
  roundStarted = true;
  syncMaximumBet();
  betStatus.textContent = `Current hand bet: $${nextBet}. Set a different amount above for the following hand.`;
  betStatus.dataset.state = 'success';
});

function frame(timestamp) {
  if (roundStarted && !playerActionsReady) {
    playGame();
  }
  if (assetsLoaded) drawBlackJack(ctx, canvas, timestamp);
  syncMaximumBet();
  requestAnimationFrame(frame);
}

syncMaximumBet();
waitForBlackjackAssets().then(() => {
  assetsLoaded = true;
  startButton.disabled = false;
  startButton.textContent = 'Start blackjack';
  dialogue.textContent = 'Choose your first bet, then select Start blackjack.';
}).catch((error) => {
  console.error(error);
  startButton.disabled = true;
  startButton.textContent = 'Blackjack unavailable';
  dialogue.textContent = 'Blackjack graphics could not load. Confirm the site still includes its existing assets folder.';
  betStatus.textContent = 'Required blackjack assets are missing or could not be loaded.';
  betStatus.dataset.state = 'error';
});
requestAnimationFrame(frame);
