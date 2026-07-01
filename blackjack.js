const background = new Image();
background.src = 'assets/ClaviculusTheWise.jpg';

const cardSprtSheet = new Image();
cardSprtSheet.src = 'assets/CardSprite.jpg';

const blankCard = new Image();
blankCard.src = 'assets/DealerDown.png';

let cards = [0, 0, 0, 0];
let cardsRendered = false;

const cardImages = [
  new Image(), // dealerShow
  new Image(), // dealerDown
  new Image(), // playerFirst
  new Image(), // playerSecond
];

const spriteSheetWidth = 2925;
const spriteSheetHeight = 1260;

//I forgot good const naming practices 
const CARD_WIDTH = spriteSheetWidth / 13;
const CARD_HEIGHT = spriteSheetHeight / 4;

let dealerTurn = false;

//This is tricky because our requestAnimationFrame from the caller schedules this to be called every so toDateString();
//So we need to check timestamp before drawing to delay cards being delt
export function drawBlackJack(ctx, canvas, timestamp) {
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  //Draw cards if values are set, last value set is player two so check if that is set before rendering cards.

  if (cardsRendered) {
    cardImages.forEach((card, i) => {
      let x = 400 + ((i % 2) * CARD_WIDTH);
      let y = ((i === 2 || i === 3) ? 300 : 0);
      if (!dealerTurn && i === 1) {
        ctx.drawImage(blankCard, x, y, 150, 200);
      } else {
        ctx.drawImage(card, x, y, 150, 200);
      }
    });
  }
}

/*
 * 1-10 = ace-10, 11 jack, 12 queen, 13 king
  */

export function makeGame() {
  for (let i = 0; i < 4; i++) {
    cards[i] = drawCard();
  }

  renderCards();
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

function renderCards() {
  cards.forEach((card, i) => {
    const suit = Math.floor(Math.random() * 4); // random suit index: 0-3
    const dataUrl = getCardSegment(card, suit);

    cardImages[i].src = dataUrl; // saves the cropped card into cardImages[i]
    cardsRendered = true;
  });
}

function drawCard() {
  return Math.floor(Math.random() * 14) + 1;
}
