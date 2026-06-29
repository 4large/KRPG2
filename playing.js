import { story } from "./story.js";
import { playad } from "./ad.js";

const background_map = backgroundMap();

const background = new Image();
background.src = background_map.get('default');

const dialogue = document.getElementById('dialogue-box');

const balance = document.getElementById('feet');

let lore = [];
const loreEnum = {
  INIT: 0
};
storyBuilder();

let curr = lore[loreEnum.INIT];

//sprite hashmap, all character sprites initialized through this
const sprite_map = spriteMap();

const sprite = new Image();
sprite.src = sprite_map.get('none');

let clickOverlay;
let buttons = [];


/*  Game Flow:
    init -> option screen -> dates (randomly selected, idk i feel i needed to write this out).
*/

export function drawPlaying(ctx, canvas) {
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(sprite, 800, 50, 400, 550);
}

export function createGameListener() {
  clickOverlay = document.createElement('div');
  clickOverlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 1200px;
        height: 700px;
        cursor: pointer;
        z-index: 10;
    `;

  clickOverlay.addEventListener('click', () => {
    let text = curr.nextDialogue();
    if (text != 'Error: pussy') printShit(text);
  });

  //when get back fix this.
  document.getElementById('magacock').appendChild(clickOverlay);

  return clickOverlay;
}

function renderbtn() {
  const sidebar = document.getElementById('choice-sidebar');
  sidebar.innerHTML = '';         // clear old buttons
  sidebar.style.display = 'flex';

  buttons.forEach(label => {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.className = 'choice-btn';

    btn.addEventListener('click', processButton);
    sidebar.appendChild(btn);
  });
}

function processButton() {
  clearButtons();
  clickOverlay.style.pointerEvents = 'auto';
}

function clearButtons() {
  const sidebar = document.getElementById('choice-sidebar');
  sidebar.style.display = 'none';
  sidebar.innerHTML = '';
  buttons = [];
}

//String will have instruction on the end, delimited by #, print string then process hashtag
function printShit(text) {
  const str = text.split("#");
  dialogue.innerText = str[0] !== "" ? str[0] : dialogue.innerText;

  if (str.length == 1) {
    sprite.src = sprite_map.get('none');
    return;
  }

  processStoryInstruction(str[1]);
}

//Processes instrtuctions after printing text, can have multiple instructions delimited by " "
//Hopefully it doesnt progress beyond sprites
function processStoryInstruction(instructionSet) {
  let instructions = instructionSet.split(" ");
  instructions.forEach(instruction => {
    let keyVal = instruction.split("=");
    switch (keyVal[0]) {
      case 'sprite':
        sprite.src = sprite_map.get(keyVal[1]);
        break;
      case 'background':
        background.src = background_map.get(keyVal[1]);
        break;
      case 'ad':
        //Other parts of the program may need to use this
        dialogue.innerText = 'Big ad mode time!';
        playad();
        break;
      case 'choicemenu':
        clickOverlay.style.pointerEvents = 'none';
        buttons = instructionSet.split(" ").slice(1);
        renderbtn();
        break;
      case 'displaybalance':
        balance.style.opacity = 1;
        break;
    }
  });
}

function backgroundMap() {
  let backgroundmap = new Map();

  //add backgrounds here
  backgroundmap.set('default', 'assets/vegasstrip.jpg');
  backgroundmap.set('epstein_casino', 'assets/epsteintemple.jpg');
  backgroundmap.set('casino', 'assets/blackingmyjack.jpg');

  return backgroundmap;
}

function spriteMap() {
  let spritemap = new Map();

  //add sprites here
  spritemap.set('none', 'assets/blank-image.png');
  spritemap.set('noah', 'assets/NoahsBarmitsvah.png');
  spritemap.set('leon', 'assets/woowooweewee.png');

  return spritemap;
}

//Builds all story objects and stores in array, lore
function storyBuilder() {
  //The story elements will have instructions past the #. IE 'story element #sprite=leon' where sprite=leon is an instruction.
  let init = [
    'In this game, you are broke as fuck. To solve this issue, like any reasonable man you decide to take everything you have to Las Vegas, your savings totalling to an overwhelming 3 dollars.',
    'Your goal is to take your femdom femboy boyfriend, Noah Buol, out on dates. The more money you spend on the dates, the better time Noah will have (because he is very materialistic) so factor that into your expenditures. #sprite=noah',
    'You\'re wandering the streets of Las Vegas trying to find a casino perfect for you and you stumble upon St James Island Casino & Resort, you recall hearing about it from your good friend Jeffery Goblinstein. You decide to go inside. #background=epstein_casino sprite=none',
    'As you enter you see many classic casino games such as slots, baccarat, poker, and killing yourself. Finally your eyes land on blackjack, a game that you foolishly believe you\'re good at, so you instantly decide to put everything on it. #background=casino',
    'As you approach the table you see an incredibly handsome dealer who you find yourself instantly attracted to, you decide to rush to his table.',
    'You approach the table and take a seat, as you sit you pull out your 3 dollars in savings and proudly plop it on the table, your change goes everywhere.',
    'The devilishly handsome and completely original dealer, catches a quarter and smiles at you. #sprite=leon',
    'Dealer: Monsieur, you \'ave dropped zis! You need to be more careful, no? #sprite=leon',
    'You\'re caught off guard and you blush as he counts the change and deals the chips, 3 big green ones is your total.',
    'Dealer: I am afraid you do not meet ze table minimum. Sacré bleu! But fear not, our great establishments owner, Benjamin Netenyahu, \'as blessed us wiz ze ability for you to watch a short vidéo from one of our sponsors to be able to get more money. #sprite=leon',
    '#ad',
    'After watching a very well made advertisement (see credits :) ) you gained yourself 5 big green ones to be able to bet. #displaybalance sprite=none',
    'Kevin: Thank you sir, whats your name by the way?',
    'Leon: Ahh oui! Ze name eez Léon, and I am not related to zat certain Resident Evil character, non! I am Fronch! Care to play, hmm? #sprite=leon',
    '#choicemenu blackjack dates store'
  ];
  lore.push(new story('init', init));
}
