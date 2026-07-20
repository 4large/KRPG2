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
const CARD_GAP = 10; // space between cards in the same row
const ROW_SPACING = 200; // vertical space between stacked split hands

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
    images: [],       // Image objects, one per entry in `cards`, same order
    wager,
    doubled: false,
    resolved: false,  // true once this hand has stood, busted, or is blackjack
  };
}

// Pure calculation of a hand's value from its raw card array.
// No side effects, no globals to keep in sync.
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

// Draws a card, renders its sprite, and appends both to the hand in lockstep.
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
//min wager is 5, so for test cases we'll use that
let wager;
//Win will represented by a char, y for yes, n for no, p for push
let win = 'n';
let balance;

let callSet = true;

let double;

const CARD_STACK_OFFSET = 42;
const HAND_GROUP_GAP = 60; //Dude i freaking hate splits

//JUST ONE MORE VARIABLE
let bust = false;
//JUST ONE MORE VARIABLE AND THEN NO MORE AFTER THAT
let insuranceAvailable = false;
let insuranceBought = false;
let insuranceEvaluated = false;

//TODO: Add special cutscene for 3 consecutive wins

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
  // Wait for the deal-in animation to finish (cardsToDraw reaches 4) before
  // showing buttons/dialogue, so the dialogue box doesn't pop in ahead of
  // the cards still being dealt onto the table.
  if (dealtCount === 4 && cardsToDraw >= 4) {
    //dispatch so we dont continual call playGame after board is delt
    document.dispatchEvent(new CustomEvent('piss', {
      detail: { myVar: true }
    }));
    setBtns(['hit', 'stand', 'double', 'split']);
  } else {
    return;
  }
}

/*
 * 1-10 = ace-10, 11 jack, 12 queen, 13 king
  */

export function makeGame(bet) {
  wager = bet;
  double = wager * 2;

  dealerHand = createHand([], wager);
  playerHands = [createHand([], wager)];
  activeHandIndex = 0;

  dealCardTo(dealerHand);
  insuranceAvailable = dealerHand.cards[0] === 1; // Before buttons set evaluate dealers up card so that we can properly set buttons
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
  insuranceBought = false;
  insuranceEvaluated = false;
}

function setBtns(btns) {
  const sidebar = document.getElementById('choice-sidebar');
  sidebar.innerHTML = '';         // clear old buttons
  sidebar.style.display = 'flex';

  const hand = playerHands[activeHandIndex];
  const iterRange = btns.length;

  //insurance
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

//Also calculates dealer and player values via computeHandTotal
function setText() {
  dialogue.style.opacity = 1;

  const hand = playerHands[activeHandIndex];
  const playerResult = computeHandTotal(hand.cards);
  const dealerResult = computeHandTotal(dealerHand.cards);

  // Natural blackjack check only applies pre-split, on the very first hand —
  // and only once insurance has been resolved (or was never offered), so a
  // dealer Ace doesn't fast-forward past the insurance prompt straight to
  // evaluateGame.
  if (
    playerHands.length === 1 &&
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
        dealerTurn = true;
        setBtns(['play again', 'quit']);
        evaluateGame();
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

// Moves play to the next unresolved player hand, or starts the dealer's
// turn once every player hand has stood, doubled, or busted.
function advanceHand() {
  activeHandIndex++;
  if (activeHandIndex < playerHands.length) {
    setBtns(['hit', 'stand', 'double', 'split']);
    setText();
  } else {
    clearButtons();
    dealerTurn = true;
    setTimeout(dealerDraw, 1000);
  }
}

function processButton(e) {
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
        //If doesnt work, use swal for notif
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
      //Boy i should REALLY make a function for this
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

      playerHands.splice(activeHandIndex + 1, 0, newHand);

      dealCardTo(hand);
      dealCardTo(newHand);

      setBtns(['hit', 'stand', 'double', 'split']);
      setText();
      break;
    }
    case 'play again':
      if (balance < wager) {
        //Currently there is a bug that when you get done (ie bet too small for your wager) it has no path to progress
        //And simply reloads gamestate. done-gambling will need to be rigged to give you game menu screen if you have enough
        //Money for a min bet. quit button will also be able to use this logic. I would think the best course of action is to
        //Write another function, similar to poor, in playing that will handle such events.
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
    //TODO: Add quit button. If below min bet, force ad. We can add another event listener so that when 
    //We quit and have enough for a min bet, it prompts choice menu and says another message (see done gambling listener
    //and poor function being called)
    case 'quit':
      document.dispatchEvent(new CustomEvent('done-gambling', {
        detail: { myVar: true }
      }));
      clearButtons()
      return;
    //Yes and no evaluate whether or not player wants insurance
    case 'yes':
      insuranceBought = true;
      insuranceEvaluated = true;
      //eval player has enough money to buy insurance (1.5 times original bet)
      //Fuckin regex
      let balancestr = document.getElementById('feet').textContent;
      let balancereg = balancestr.match(/(\d+)/);
      balance = Number(balancereg[0]);
      if (balance < (Math.floor(wager / 2) + wager)) {
        dialogue.innerHTML = 'You are too poor for insurance';
      } else {
        dealerTurn = true;
        evaluateGame();
      }
      break;
    case 'no':
      insuranceBought = false;
      insuranceEvaluated = true;
      //Evaluate for dealer blackjack, if dealer blackjack then you lose
      if (dealerHand.cards[1] === 10) {
        //Not yet tested for dealer having blackjack, but works fine otherwise
        dealerTurn = true;
        evaluateGame();
      } else {
        setBtns(['hit', 'stand', 'double', 'split']);
      }
      break;
  }
}

function evaluateGame() {
  callSet = false;

  const dealerResult = computeHandTotal(dealerHand.cards);

  let balancestr = document.getElementById('feet').textContent;
  let balancereg = balancestr.match(/(\d+)/);
  balance = Number(balancereg[0]);

  let totalPayout = 0;
  const messages = [];

  //TODO: evaluate game if insurance is bought. May just be easier to have rest of eval in here to avoid complex branching
  if (insuranceBought) {
    if (dealerHand.cards[1] === 10) {
      dialogue.innerHTML = 'Dealer has blackjack, your insurance bet pays out.';
      setBtns(['play again', 'quit']);
    } else {
      dialogue.innerHTML = 'Dealer doesn\'t have blackjack, you lose wager and insurance.';
      balance = balance - wager - Math.floor(wager / 2);
      document.getElementById('feet').textContent = 'Balance: ' + balance;
    }
    clearButtons();
    setBtns(['play again', 'quit']);
    return;
  }

  playerHands.forEach((hand, i) => {
    const p = computeHandTotal(hand.cards);
    const stake = hand.wager;
    const label = playerHands.length > 1 ? `Hand ${i + 1}: ` : '';

    let outcome;
    let msg;

    if (playerHands.length === 1 && p.blackjack && !dealerResult.blackjack) {
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

  setBtns(['play again', 'quit']);
}

//Dealer draws until 17 or bust, takes away control from player
async function dealerDraw() {
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

//Sprite sheet 2925x1260
function getCardSegment(value, suit) {
  const x = CARD_WIDTH * (value - 1);
  const y = CARD_HEIGHT * suit;

  // temporary canvas to crop just this one card
  const cropCanvas = document.createElement('canvas');
  cropCanvas.width = CARD_WIDTH;
  cropCanvas.height = CARD_HEIGHT;
  const cropCtx = cropCanvas.getContext('2d');

  cropCtx.drawImage(
    cardSprtSheet,
    x, y, CARD_WIDTH, CARD_HEIGHT,   // source rect from sprite sheet
    0, 0, CARD_WIDTH, CARD_HEIGHT    // dest rect on the temp canvas
  );

  return cropCanvas.toDataURL(); // returns a usable image src (for an entire picture, its 'assets/picturename.jpg'
}

function drawCard() {
  return Math.floor(Math.random() * 13) + 1;
}

//TEST ONLY!
function dealSpecificCardTo(hand, cardValue) {
  const suit = Math.floor(Math.random() * 4);
  const img = new Image();
  img.src = getCardSegment(cardValue, suit);

  hand.cards.push(cardValue);
  hand.images.push(img);

  return computeHandTotal(hand.cards);
}