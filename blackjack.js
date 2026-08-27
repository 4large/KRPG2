const background = new Image();
background.src = 'assets/ClaviculusTheWise.jpg';

const cardSprtSheet = new Image();
cardSprtSheet.src = 'assets/CardSprite.jpg';

const blankCard = new Image();
blankCard.src = 'assets/DealerDown.png';

let cardsRendered = false;

const spriteSheetWidth = 2925;
const spriteSheetHeight = 1260;
const CARD_WIDTH = spriteSheetWidth / 13;
const CARD_HEIGHT = spriteSheetHeight / 4;

const CARD_DRAW_WIDTH = 125;
const CARD_DRAW_HEIGHT = 180;
const CARD_GAP = 10;
const ROW_SPACING = 200;

const DEALER_Y = 105;
const PLAYER_BASE_Y = 405;

const dialogue = document.getElementById('dialogue-box');

let dealerTurn = false;
let timeElapsed = 0;
let cardsToDraw = 0;
let dealTimeStart;

function createHand(cards = [], wager = 5) {
  return {
    cards: [...cards],
    images: [],
    wager,
    doubled: false,
    resolved: false,
    isAces: false,  // NEW: track if this hand came from splitting aces
  };
}

function computeHandTotal(cards) {
  const floored = cards.map((c) => (c > 10 ? 10 : c));
  let total = floored.reduce((a, b) => a + b, 0);
  const hasAce = cards.includes(1);
  const soft = hasAce && total + 10 <= 21;
  if (soft) total += 10;
  return {
    total,
    soft,
    bust: total > 21,
    blackjack: cards.length === 2 && total === 21,
  };
}

function dealCardTo(hand) {
  const cardValue = drawCard();
  const suit = Math.floor(Math.random() * 4);
  const img = new Image();
  img.src = getCardSegment(cardValue, suit);

  hand.cards.push(cardValue);
  hand.images.push(img);

  return computeHandTotal(hand.cards);
}

let dealerHand = createHand();
let playerHands = [createHand()];
let activeHandIndex = 0;

let payout = 0;
let wager;
let win = 'n';
let balance;

let callSet = true;

let double;

const CARD_STACK_OFFSET = 42;
const HAND_GROUP_GAP = 60;

let bust = false;
let insuranceAvailable = false;
let insuranceWon = false;
let insuranceEvaluated = false;

let winstreak = 0;
let sniffed = false;

export function drawBlackJack(ctx, canvas, timestamp) {
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  if (cardsRendered) {
    if (dealTimeStart === undefined) {
      dealTimeStart = timestamp;
    }
    timeElapsed = timestamp - dealTimeStart;
    if (timeElapsed < 1100) {
      cardsToDraw = Math.floor(timeElapsed / 250);
    }

    const dealerStartX = (canvas.width - handWidth(dealerHand, 0)) / 2;
    drawHandRow(ctx, dealerHand, dealerStartX, DEALER_Y, { dealSlotStart: 0, isDealer: true });

    const handWidths = playerHands.map((hand, i) =>
      handWidth(hand, i === 0 ? 2 : null)
    );
    const totalWidth =
      handWidths.reduce((a, b) => a + b, 0) +
      (playerHands.length - 1) * HAND_GROUP_GAP;
    let groupStartX = (canvas.width - totalWidth) / 2;

    playerHands.forEach((hand, i) => {
      drawHandRow(ctx, hand, groupStartX, PLAYER_BASE_Y, {
        dealSlotStart: i === 0 ? 2 : null,
        isDealer: false,
      });
      groupStartX += handWidths[i] + HAND_GROUP_GAP;
    });
  }
}

function visibleCardCount(hand, dealSlotStart) {
  if (dealSlotStart === null) return hand.cards.length;
  const staggeredVisible = Math.max(0, Math.min(2, cardsToDraw - dealSlotStart));
  return hand.cards.length <= 2 ? staggeredVisible : staggeredVisible + (hand.cards.length - 2);
}

function handWidth(hand, dealSlotStart) {
  const visibleCount = visibleCardCount(hand, dealSlotStart);
  if (visibleCount === 0) return 0;
  return visibleCount * CARD_DRAW_WIDTH + (visibleCount - 1) * CARD_GAP;
}

function drawHandRow(ctx, hand, startX, y, { dealSlotStart, isDealer }) {
  const visibleCount = visibleCardCount(hand, dealSlotStart);
  if (visibleCount === 0) return;

  for (let i = 0; i < visibleCount; i++) {
    const x = startX + i * (CARD_DRAW_WIDTH + CARD_GAP);
    if (isDealer && i === 1 && !dealerTurn) {
      ctx.drawImage(blankCard, x, y, CARD_DRAW_WIDTH, CARD_DRAW_HEIGHT);
    } else {
      ctx.drawImage(hand.images[i], x, y, CARD_DRAW_WIDTH, CARD_DRAW_HEIGHT);
    }
  }
}

export function playGame() {
  const dealtCount = dealerHand.cards.length + playerHands[0].cards.length;
  if (dealtCount === 4 && cardsToDraw >= 4) {
    document.dispatchEvent(new CustomEvent('piss', {
      detail: { myVar: true }
    }));
    setBtns(['hit', 'stand', 'double', 'split']);
  } else {
    return;
  }
}

export function makeGame(bet) {
  wager = bet;
  double = wager * 2;

  dealerHand = createHand([], wager);
  playerHands = [createHand([], wager)];
  activeHandIndex = 0;

  dealCardTo(dealerHand);
  insuranceAvailable = dealerHand.cards[0] === 1;
  dealCardTo(dealerHand);
  dealCardTo(playerHands[0]);
  dealCardTo(playerHands[0]);

  cardsRendered = true;
}

export function resetGame() {
  cardsRendered = false;

  dealerHand = createHand();
  playerHands = [createHand()];
  activeHandIndex = 0;

  dealerTurn = false;
  timeElapsed = 0;
  cardsToDraw = 0;
  dealTimeStart = undefined;

  payout = 0;
  win = 'n';
  callSet = true;

  dialogue.style.opacity = 1;
  dialogue.textContent = '';

  if (double === wager) {
    wager = double / 2;
  }

  bust = false;
  insuranceAvailable = false;
  insuranceWon = false;
  insuranceEvaluated = false;

  if (winstreak >= 3) {
    winstreak = 0;
  }
}

function setBtns(btns) {
  const sidebar = document.getElementById('choice-sidebar');
  sidebar.innerHTML = '';
  sidebar.style.display = 'flex';

  const hand = playerHands[activeHandIndex];
  const iterRange = btns.length;

  if (insuranceAvailable && !insuranceEvaluated) {
    const yes = document.createElement('button')
    yes.textContent = 'yes';
    yes.className = 'choice-btn';
    yes.addEventListener('click', processButton);
    sidebar.appendChild(yes);

    const no = document.createElement('button')
    no.textContent = 'no';
    no.className = 'choice-btn';
    no.addEventListener('click', processButton);
    sidebar.appendChild(no);
  } else {
    for (let i = 0; i < iterRange; i++) {
      // NEW: disable hit/stand/double on split aces — only allow stand
      if (hand && hand.isAces) {
        if (btns[i] !== 'stand') continue;
      }

      if (btns[i] === 'split' && (!hand || hand.cards.length !== 2 || Math.min(hand.cards[0], 10) !== Math.min(hand.cards[1], 10))) {
        continue;
      }
      if (btns[i] === 'double' && (!hand || hand.cards.length !== 2 || hand.doubled)) {
        continue;
      }
      const btn = document.createElement('button');
      btn.textContent = btns[i];
      btn.className = 'choice-btn';

      btn.addEventListener('click', processButton);
      sidebar.appendChild(btn);
    }
  }

  if (!dealerTurn) setText();
}

function setText() {
  dialogue.style.opacity = 1;

  const hand = playerHands[activeHandIndex];
  const playerResult = computeHandTotal(hand.cards);
  const dealerResult = computeHandTotal(dealerHand.cards);

  // Blackjack check — works for any hand, including splits
  if (
    hand.cards.length === 2 &&
    dealerHand.cards.length === 2 &&
    (!insuranceAvailable || insuranceEvaluated)
  ) {
    const dealerBJ = dealerResult.blackjack;
    if (playerResult.blackjack || dealerBJ) {
      win = playerResult.blackjack && !dealerBJ
        ? 'bj'
        : (dealerBJ && !playerResult.blackjack ? 'n' : 'p');
      if (callSet) {
        hand.resolved = true;

        // FIX: always advance after blackjack, don't check dealerTurn
        advanceHand();
      }
      return;
    }
  }

  if (playerResult.bust) {
    hand.resolved = true;
    if (callSet) {
      advanceHand();
    }
    return;
  }

  const dealerUpCard = dealerHand.cards[0];
  const dealerShown = insuranceAvailable
    ? 'Dealer shows an Ace'
    : 'Dealer shows ' + Math.min(dealerUpCard, 10);
  let playerText = '\nYou show ' + playerResult.total;
  if (playerHands.length > 1) {
    playerText = `\nHand ${activeHandIndex + 1}/${playerHands.length}: ` + playerResult.total;
  }
  playerText += insuranceAvailable && !insuranceEvaluated
    ? '. Would you like to buy insurance for ' + Math.floor(wager / 2) + ' dollars?'
    : '. What will you do?';

  dialogue.textContent = dealerShown + playerText;
}

function clearButtons() {
  const sidebar = document.getElementById('choice-sidebar');
  sidebar.style.display = 'none';
  sidebar.innerHTML = '';
}

function advanceHand() {
  activeHandIndex++;
  if (activeHandIndex < playerHands.length) {
    // Skip already-resolved hands (e.g., split aces)
    while (activeHandIndex < playerHands.length && playerHands[activeHandIndex].resolved) {
      activeHandIndex++;
    }
  }

  if (activeHandIndex < playerHands.length) {
    setBtns(['hit', 'stand', 'double', 'split']);
    setText();
  } else {
    clearButtons();
    dealerTurn = true;
    setTimeout(dealerDraw, 1000);
  }
}

async function processButton(e) {
  let action = (e.target.innerText || e.target.innerHTML).toLowerCase();
  const hand = playerHands[activeHandIndex];

  switch (action) {
    case 'hit': {
      const result = dealCardTo(hand);
      if (result.bust) {
        hand.resolved = true;
        bust = true;
        advanceHand();
      } else {
        setBtns(['hit', 'stand', 'double', 'split']);
        setText();
      }
      break;
    }
    case 'stand':
      hand.resolved = true;
      advanceHand();
      break;
    case 'double': {
      let balancestr = document.getElementById('feet').textContent;
      let balancereg = balancestr.match(/(\d+)/);
      balance = Number(balancereg[0]);
      const doubleAmount = hand.wager * 2;
      if (doubleAmount > balance) {
        dialogue.textContent = 'Insufficient funds for a double';
        break;
      }
      hand.wager = doubleAmount;
      hand.doubled = true;

      dealCardTo(hand);
      hand.resolved = true;
      advanceHand();
      break;
    }
    case 'split': {
      let balancestr = document.getElementById('feet').textContent;
      let balancereg = balancestr.match(/(\d+)/);
      balance = Number(balancereg[0]);

      if (wager * 2 > balance) {
        dialogue.innerHTML = 'You are too poor to do this, broke ass bitch.';
        break;
      }

      const newHand = createHand([], hand.wager);
      const movedCard = hand.cards.pop();
      const movedImage = hand.images.pop();
      newHand.cards.push(movedCard);
      newHand.images.push(movedImage);

      // Mark as split aces if EITHER card was an ace
      if (movedCard === 1 || hand.cards[0] === 1) {
        hand.isAces = true;
        newHand.isAces = true;
      }

      playerHands.splice(activeHandIndex + 1, 0, newHand);

      dealCardTo(hand);
      dealCardTo(newHand);

      // Split aces: one card each, auto-stand, go to dealer
      if (hand.isAces) {
        hand.resolved = true;
        newHand.resolved = true;
        activeHandIndex = playerHands.length;
        clearButtons();
        dealerTurn = true;
        setTimeout(dealerDraw, 1000);
        return;
      }

      setBtns(['hit', 'stand', 'double', 'split']);
      setText();
      break;
    }
    case 'play again':
      if (balance < wager) {
        document.dispatchEvent(new CustomEvent('done-gambling', {
          detail: { myVar: true }
        }));
        clearButtons()
        return;
      }
      clearButtons();
      resetGame();
      document.dispatchEvent(new CustomEvent('blackjack', {
        detail: { wager }
      }));
      break;
    case 'quit':
      document.dispatchEvent(new CustomEvent('done-gambling', {
        detail: { myVar: true }
      }));
      clearButtons()
      return;
    case 'yes':
      insuranceWon = true;
      insuranceEvaluated = true;
      let balancestr = document.getElementById('feet').textContent;
      let balancereg = balancestr.match(/(\d+)/);
      balance = Number(balancereg[0]);
      if (balance < (Math.floor(wager / 2) + wager)) {
        dialogue.innerHTML = 'You are too poor for insurance';
      } else {
        if (dealerHand.cards[1] >= 10) {
          dealerTurn = true;
          evaluateGame();
        } else {
          clearButtons();
          insuranceWon = false;
          dialogue.innerHTML = 'Dealer did not have blackjack.';
          balance -= (Math.floor(wager / 2));
          document.getElementById('feet').textContent = 'Balance: ' + balance;
          await wait();
          await wait();
          setBtns(['hit', 'stand', 'double', 'split']);
        }
      }
      break;
    case 'no':
      insuranceWon = false;
      insuranceEvaluated = true;
      if (dealerHand.cards[1] === 10) {
        dealerTurn = true;
        evaluateGame();
      } else {
        setBtns(['hit', 'stand', 'double', 'split']);
      }
      break;
  }
}

async function evaluateGame() {
  callSet = false;

  const dealerResult = computeHandTotal(dealerHand.cards);

  let balancestr = document.getElementById('feet').textContent;
  let balancereg = balancestr.match(/(\d+)/);
  balance = Number(balancereg[0]);

  let totalPayout = 0;
  const messages = [];

  if (insuranceWon) {
    dialogue.innerHTML = 'Dealer has blackjack, your insurance bet pays out.';
    setBtns(['play again', 'quit']);
    return;
  }

  playerHands.forEach((hand, i) => {
    const p = computeHandTotal(hand.cards);
    const stake = hand.wager;
    const label = playerHands.length > 1 ? `Hand ${i + 1}: ` : '';

    let outcome;
    let msg;

    if (p.blackjack && !dealerResult.blackjack) {
      outcome = 'bj';
      msg = 'Blackjack! You win!';
    } else if (p.bust) {
      outcome = 'n';
      msg = `${label}You bust with ${p.total}. You lose!`;
    } else if (dealerResult.bust) {
      outcome = 'y';
      msg = `${label}Dealer busts. You win!`;
    } else if (dealerResult.total > p.total) {
      outcome = 'n';
      msg = `${label}Dealer beats your ${p.total} with ${dealerResult.total}. You lose!`;
    } else if (p.total > dealerResult.total) {
      outcome = 'y';
      msg = `${label}You beat dealer's ${dealerResult.total} with ${p.total}. You win!`;
    } else {
      outcome = 'p';
      msg = `${label}You and dealer both draw to ${dealerResult.total}. You push!`;
    }

    if (outcome === 'bj' || outcome === 'y') {
      winstreak++;
    } else if (outcome === 'n') {
      winstreak = 0;
    }

    totalPayout += outcome === 'bj' ? Math.floor(stake * 1.5)
      : outcome === 'y' ? stake
        : outcome === 'n' ? -stake
          : 0;

    if (i === playerHands.length - 1) win = outcome;
    messages.push(msg);
  });

  payout = totalPayout;
  dialogue.textContent = messages.join('\n');

  balance += payout;
  document.getElementById('feet').textContent = 'Balance: ' + balance;

  if (!sniffed && winstreak >= 3) {
    sniffed = true;
    await wait();
    document.dispatchEvent(new CustomEvent('netanyahu', {}));
  } else {
    setBtns(['play again', 'quit']);
  }
}

async function dealerDraw() {
  playerHands.forEach(hand => {
    let handBust = computeHandTotal(hand.cards).bust;
    bust = bust && handBust;
  });

  while (true) {
    if (bust) break;
    const house = computeHandTotal(dealerHand.cards);
    if (house.total > 16) break;

    dealCardTo(dealerHand);
    await wait();
  }

  evaluateGame();
}

function wait() {
  return new Promise((resolve) => setTimeout(resolve, 750));
}

function getCardSegment(value, suit) {
  const x = CARD_WIDTH * (value - 1);
  const y = CARD_HEIGHT * suit;

  const cropCanvas = document.createElement('canvas');
  cropCanvas.width = CARD_WIDTH;
  cropCanvas.height = CARD_HEIGHT;
  const cropCtx = cropCanvas.getContext('2d');

  cropCtx.drawImage(
    cardSprtSheet,
    x, y, CARD_WIDTH, CARD_HEIGHT,
    0, 0, CARD_WIDTH, CARD_HEIGHT
  );

  return cropCanvas.toDataURL();
}

function drawCard() {
  return Math.floor(Math.random() * 13) + 1;
}

function dealSpecificCardTo(hand, cardValue) {
  const suit = Math.floor(Math.random() * 4);
  const img = new Image();
  img.src = getCardSegment(cardValue, suit);

  hand.cards.push(cardValue);
  hand.images.push(img);

  return computeHandTotal(hand.cards);
}