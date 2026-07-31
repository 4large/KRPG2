import { story } from "./story.js";
import { playad } from "./ad.js";
import { kevin } from "./game.js";

const background_map = backgroundMap();

const background = new Image();
background.src = background_map.get('default');

const dialogue = document.getElementById('dialogue-box');

const balance = document.getElementById('feet');

let lore = [];
const loreEnum = {
  INIT: 0,
  SNIFF: 1,
  TRASHRACE: 2,
  SUPERFUCK: 3
};
storyBuilder();

let curr = lore[loreEnum.INIT];
let mainStory;  //Will be used to cache our most recent story point so if we branch off we can return to it later

//sprite hashmap, all character sprites initialized through this
const sprite_map = spriteMap();

const sprite = new Image();
sprite.src = sprite_map.get('none');

let clickOverlay;
let buttons = [];
let btnSelect = '';

let adMoney = 2;
const adMax = 250;

let wager = 5;
let tip = false;  //Used to differentiate wager between a tip and blackjack (cause im lazy)

let dealerBal = 0;

const completedDates = new Set(); //TODO: make sure this doesn't redo dates

const dateInstructionCallArr = [
  (branch) => date1(branch),
  (branch) => date2(branch)
];

let health;
let magic;
let chanceToMiss = 0;
let battleWinner;

let enemyHealth;
let enemyName;

//As per making the mapping, you can only unlock these moves, add new moves here.
const moveMapFunc = new Map([
  ['Hit', () => {
    enemyHealth -= 2;
    kevin.setMp(1);
    chanceToMiss = 0;
    dialogue.innerHTML = 'You used Hit on the opponent.';
  }],
  ['Duck', () => {
    kevin.setMp(2);
    chanceToMiss = 50;  //percent
    dialogue.innerHTML = 'You used Duck.';
  }],
  ['Tel-Aviv-Smash', () => {
    if (magic < 8) {
      dialogue.innerHTML = 'Insufficient mp for TEL AVIV SMASH';
      return;
    }

    enemyHealth -= 5;
    kevin.setMp(-8);
    chanceToMiss = 0;
    dialogue.innerHTML = 'You used Tel Aviv Smash on the opponent';
  }]
]);

const enemyMoveMap = new Map([
  ['Fuck-Kevin-Smash', () => {
    kevin.setHp(-3);
  }],
  ['나는 어린 남자아이들을 강간한다', () => {
    kevin.setHp(-1);
  }],
  ['Our Glorious Leader', () => {
    kevin.setHp(-4);
  }]
])

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

//If you go broke, make player watch ad for money
export async function poor() {
  dialogue.innerHTML = 'Léon: Sacre bleu! You don\'t \'ave enough money to play. You must watch zis ad!';
  await wait(2000);

  await playad('Brought to you by Benjamin Netanyahu INC.');
  adMoney = (adMoney * 2 > adMax) ? adMax : adMoney * 2;
  let balanceAmount = balance.innerHTML.match(/(\d+)/);
  let bal = Number(balanceAmount[0]);
  bal += adMoney;
  balance.innerHTML = 'Balance: ' + bal;

  if (bal < 5) {
    document.dispatchEvent(new CustomEvent('done-gambling', {
      detail: { myVar: true }
    }));
    return;
  } else {
    //Set to choice menu for playing, set dialogue as well
    dialogue.innerHTML = 'Léon: Zank you for vatching zat ad! Vat vould you like to do, fine gentleman?';
    printShit('#choicemenu blackjack dates store tip-dealer');
  }
}

//Gives choice menu again for gameplay loop, if player has enough for at least one min bet
export async function notPoor(casino) {
  dialogue.innerHTML = (casino) ? 'Léon: A good session, Monsieur. Vat vould you like to do now?' :
    'Léon: Monsieur, you deedn\'t get stabbed at ze store? Très bien! \'Ow can I \'elp you out now?';
  await wait(2000); //Not really sure why this is necessary, prolly some sort of race but this helps actually print buttons
  printShit('#choicemenu blackjack dates store tip-dealer');
}

export async function theSniff() {
  clearButtons();
  await wait(250);
  curr = lore[loreEnum.SNIFF];
  let text = curr.nextDialogue();
  if (text != 'Error: pussy') printShit(text);
}

/* -------------------DATE LOGIC FUNCTIONS--------------------- */
function date1(branch) {
  const intel = kevin.intelligence;
  console.log('Intel:', intel, '| Branch:', branch);

  mainStory = curr;

  switch (branch) {
    case '1':
      //TODO: Add sprites for the trash cars to the story
      if (intel >= 16) {
        console.log('GOAT');
        curr = new story('goat car', [
          'You quickly build a masterpiece of a vehicle able to rival any trash car made ever. You look at the enemy, his car is weak, trash, and horrible. You know you will dominate this race.  Even Noah begins to gain confidence.',
          '#returntomain'
        ]);
      } else if (intel >= 11) {
        console.log('FINE');
        curr = new story('fine car', [
          'You efficiently build your car into a working state as you look at your adversaries car you can tell yours looks in better shape.',
          '#returntomain'
        ]);
      } else if (intel >= 8) {
        console.log('SHIT');
        curr = new story('fine car', [
          'You build your car with every part in the garbage and minimal precision as you feel this race may be closer than you initially assumed.',
          'Your flimsy car gets pushed to the roadside, sweat beading down your face with concern.',
          '#returntomain'
        ]);
      } else {
        console.log('SHIT (high confidence)');
        curr = new story('fine car', [
          'You build your car much quicker than the adversary, your confidence of winning this race is through the roof. Nothing can stop you now!',
          'You push your car to I-15. It sways easily, but that means its more aerodynamic! Noah expresses his concern, but he isnt the master gambler!',
          '#returntomain'
        ]);
      }
      break;
    case '2':
      //Maybe dont have dates end until you arrive at the casino for easy evaluation, then you can load the choice menu easily.
      if (intel >= 16) {
        console.log('GOAT win');
        curr = new story('goat win', [
          'You see the flag drop and you kick it into high gear moving at an unprecedented 8 miles per hour, the homeless men gawk as theyve never seen a trash racer this fast before. #background=trashrace',
          'You speed past Packson leaving him instantly in the dust.',
          'You pass the checkered flag 3 minutes before he does. He simply cannot compete with your astounding architecture. #background=nascar',
          'You wait for Packson to cross the finish line as you and the other homeless men laugh hysterically at the defeated man.',
          'Kevin: You fucking SUCK Packson. So much for the so called “King of I-15” Pay up bitch, your time as the king of the interstate is OVER.',
          'Packson dejectedly hands over the 5 dollars as all the homeless men cheer your name. You walk up to Noah.',
          'Kevin: Heres your 10 dollars, buy yourself something nice.',
          'Noah takes the 10 dollars and begins to dry hump your leg. you as you feel your relationship get much stronger.',
          'You drive your immaculate creation back to the casino #background=casino',
          'Léon: Monsieur, what an immaculate stallion! Where did you come across such a beauty, eh? #sprite=leon',
          'Kevin: Oh this trash car? Yeah I just whipped it up meself, usin\' these. #sprite=none',
          'You attempt to flex, but you neglect your lack of muscles. Perhaps this date has made you a touch overzealous.',
          'Léon: Well done Monsiuer! Have you come back to play some more? #sprite=leon',
          '#choicemenu blackjack dates store tip-dealer'
        ]);
        kevin.date_endings[0] = 2;
      } else if (intel >= 11) {
        console.log('Slim win');
        curr = new story('slim win', [
          'You get a quick release off the flag dropping. The heat of the battle is felt fully in your legs but damnit a Marvel Rivals skin is on the line! #background=trashrace',
          'You’re clocking lightning fast speeds of up to 5 miles per hour, you’re good. In your rear view aluminum foil, you see Packson closing in, his speed outmatching yours, but the finish line is right there.',
          'With your little vigor and ferocity, you expunge every ounce of strength and so does he as you both cross the waving checkered flag. #background=nascar',
          'Noah rushes to your side as fast as his lazy fat legs can carry him. You and Packson both look to the ref as he ponders, your heart beating and finally the winner is announced.',
          'Homeless Bum: AND THE WINNER IS, KEVIN. #sprite=homeless',
          'My god, a victory.',
          'You look toward Packson and extend your sweaty right hand. Packson looks at and shakes it.',
          'Packson: Perhaps, 2 can rule I-15. Here\'s your 5 dollars as promised. #sprite=jackson',
          'Random Driver: GET OUT THE FUCKING WAY YOU BUMS! #sprite=pissed',
          'You quickly get out of the highway as the drivers throw beer cans at you and you revel in your victory.',
          'You feel your relationship get a little stronger.',
          'You drive the trash car back to the casino #background=casino',
          'Léon: Monsieur, did you \'ave a good time on your date, \'mm? #sprite=leon',
          'Kevin: I engaged in a fierce competition, a battle for the ages, a race for everything, I almost lost my life, now, I am now a co-king of I-15.',
          'Léon: Zat\'s amazing, Monsieur! I\'ll be sure to deal ze co-king of I-15 an extra special \'and, \'mm? #sprite=leon',
          '#choicemenu blackjack dates store tip-dealer'
        ]);
        kevin.date_endings[0] = 1;
      } else {
        console.log('Horrible loss');
        curr = new story('oof', [
          'You start peddling your weak ass legs as you remember you haven’t worked out since the moment you came out of the womb #background=trashrace',
          'You look at Packson as he initially leads and put your legs into overdrive going up to 2 miles an hour.',
          'You pass Packson but eventually you feel your legs give out as your car falls over and you crash. #background=carcrash',
          'Packson quickly takes the lead and its over as slowly as it started.',
          'Noah looks at you disappointed and you can feel your relationship getting worse.',
          'Packson walks up to you and spits in your face.',
          'Packson: You fucking SUCK. Give me my 5 dollars you little bitch. NEVER make another trash car again. #sprite=jackson',
          'You solemnly hand over all 5 of your dollars. The streets remain Packson’s.',
          'You stare at the smoldering ashes, the trash car now in complete disarray. You are forces to walk back to the casino.',
          'Noah doesn\'t say a word, the mere act of walking and being outdoors and not in an air conditioned trash car is extremely painful to him. #background=default',
          'Léon: Monsiuer, why the long face? #background=casino sprite=leon',
          'Kevin: I lost a trash car race. I\'ve been humiliated and my legacy is now in tatters. I think I may even be castrated.',
          'Léon: Monsiuer, I am so sorry! Trash car racing is a dirty business. I do know, however, that a hand of blackjack is just what you need to cheer you up. #sprite=leon',
          '#choicemenu blackjack dates store tip-dealer'
        ]);
        kevin.date_endings[0] = -1;
      }
      break;
  }

  let text = curr.nextDialogue();
  if (text != 'Error: pussy') printShit(text);
}

function date2(branch) {
  mainStory = curr;
  const trashCarResult = kevin.date_endings[0];

  switch (branch) {
    case '1':
      if (trashCarResult > 0) {
        curr = new story('tmp', [
          'You take Noah in your victorious vehicle, your wonderful trash car which you hide out back of the casino. You drive for 4 hours to make it the requisite 2 miles. #background=trashrace',
          '#returntomain'
        ]);
      } else {
        curr = new story('tmp', [
          'You grab Noah from the Casino and walk for 2 hours to make it the requisite 2 miles. The intense distance of 2 whole miles puts a ruthless strain on the unathletic Noah. He is already unhappy. #background=default', //TODO: I think jimmy will give new background here
          '#returntomain'
        ]);
      }
      let text = curr.nextDialogue();
      if (text != 'Error: pussy') printShit(text);
      break;
    case '2':
      clickOverlay.style.pointerEvents = 'none';
      
      //Battle scene. must loop and must let kevin use his special moves. Must update hp, mp based on actions. Opponent selects a random move.
      health = kevin.hp;
      enemyHealth = 15;
      magic = kevin.mp;
      enemyName = 'Hibachi Man';

      dialogue.innerHTML = `You have been challenged by 케빈은 개자식이야. You have ${health} hp and ${magic} mp. What will you do?`;

      const moves = getMoves();
      printShit(`#choicemenu ${moves}`);

      break;
  }
}

function getMoves() {
  const moves = ['Hit', 'Duck'];
  const specialMoves = kevin.special_moves;

  specialMoves.forEach(move => {
    moves.push(move);
  });
  const movesStr = moves.join(' ');
  return movesStr;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function clearButtons() {
  const sidebar = document.getElementById('choice-sidebar');
  sidebar.style.display = 'none';
  sidebar.innerHTML = '';
  buttons = [];
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

function processButton(e) {
  clearButtons();
  clickOverlay.style.pointerEvents = 'auto';
  btnSelect = e.target.innerText || e.target.textContent;
  processInstruction();
}

async function processInstruction() {
  //The motherfucking load
  let tmp;
  switch (btnSelect) {
    case 'blackjack':
      //User selects wager using choicemenu buttons, waits on enter to before dispatching game code (segment from dialogue opacity and below)
      buttons = ['MAX', '⇈', '⇑', 'Enter', '⇓', '⇊', 'MIN'];
      dialogue.innerHTML = 'Current wager: 5';  //safest choice is to just always set the wager to 5 since atp, user should have at least 5 dollars.
      tip = false;
      wager = 5;
      renderbtn();
      break;
    case 'store':
      document.dispatchEvent(new CustomEvent('store', {}));
      break;
    case 'dates':
      dialogue.innerHTML = 'Select a date tier.';
      buttons = ['$500', '$50', '$5'];
      renderbtn();
      break;
    case 'tip-dealer':
      //Must have at least 10 dollars to tip
      let balanceAmount = balance.innerHTML.match(/(\d+)/);
      let bal = Number(balanceAmount[0]);
      if (bal < 10) {
        dialogue.innerHTML = 'Léon: Monsieur, you do not \'ave ze money to tip me, perhaps you try a \'and first, no?';
        printShit('#choicemenu blackjack dates store tip-dealer');  //Seems to work for setting choice menu buttons, tho its unused outside this context
        break;
      }
      wager = 5;

      buttons = ['MAX', '⇈', '⇑', 'Enter', '⇓', '⇊', 'MIN'];
      dialogue.textContent = 'Select a tip amount: 5';
      tip = true;
      renderbtn();
      break;
    //Cases related to wagers, wager can be for dealer tip 
    case 'MAX':
      adjustWager(10000000000);
      break;
    case '⇈':
      adjustWager(5);
      break;
    case '⇑':
      adjustWager(1);
      break;
    //Needs to branch on tip so we dont launch blackjack after tipping
    case 'Enter':
      if (tip) {
        let balanceAmount = balance.innerHTML.match(/(\d+)/);
        let bal = Number(balanceAmount[0]);

        bal -= wager;
        dealerBal += wager;

        dialogue.innerHTML = 'Leon: Merci! You are a generous man!';
        balance.innerHTML = 'Balance ' + bal;

        if (dealerBal >= 500) {
          //Have special date occur here
        }
        printShit('#choicemenu blackjack dates store tip-dealer');
      } else {
        dialogue.style.opacity = 0;
        //callback to main that changes gamestate
        document.dispatchEvent(new CustomEvent('blackjack', {
          detail: { wager }
        }));
      }
      break;
    case '⇓':
      adjustWager(-1);
      break;
    case '⇊':
      adjustWager(-5);
      break;
    case 'MIN':
      adjustWager(-10000000000);
      break;
    //Money selections validate monetary status IE do you have enough money to go on a date, then randomly select one. 
    //Dates are stored in the lore array and upon completion, the specific date needs to be store to ensure it isnt used again
    case '$5':
      //5 dollar date index - 2
      if (!validateDateEligibility(5)) {
        dialogue.innerHTML = 'Monsieur, you must not use all your budget for ze date. You still need enough afterwards to make ze table minimum, no?';
        printShit('#choicemenu blackjack dates store tip-dealer');
        break;
      }

      printShit('#sprite=none');

      curr = lore[selectRandomDate(5)];
      tmp = curr.nextDialogue();
      if (tmp != 'Error: pussy') printShit(tmp);
      break;
    case '$50':
      if (!validateDateEligibility(50)) {
        dialogue.innerHTML = 'Monsieur, you must not use all your budget for ze date. You still need enough afterwards to make ze table minimum, no?';
        printShit('#choicemenu blackjack dates store tip-dealer');
        break;
      }

      printShit('#sprite=none');

      curr = lore[selectRandomDate(50)];
      tmp = curr.nextDialogue();
      if (tmp != 'Error: pussy') printShit(tmp);
      break;
    case '$500':
      if (!validateDateEligibility(500)) {
        dialogue.innerHTML = 'Monsieur, you must not use all your budget for ze date. You still need enough afterwards to make ze table minimum, no?';
        printShit('#choicemenu blackjack dates store tip-dealer');
        break;
      }

      printShit('#sprite=none');

      curr = lore[selectRandomDate(500)];
      tmp = curr.nextDialogue();
      if (tmp != 'Error: pussy') printShit(tmp);
      break;
    //this will handle moves, since we can't switch on all moves at once, we'll handle it as a fallthrough.
    default:
      const func = moveMapFunc.get(btnSelect);
      if (func === undefined) {
        dialogue.innerHTML = 'Invalid button selection, the button pressed does not have any attached code. Have you considered death as a option?';
        break;
      }
      //TODO: Move mp needs to be checked here, that way player isnt penalized for lack of mp.

      func();
      await wait(2000);

      if (enemyHealth <= 0) {
        dialogue.innerHTML = 'The opponent has been defeated, you are the winner!';
        battleWinner = true;
        printShit('#returntomain');
        clickOverlay.style.pointerEvents = 'auto';
        break;
      }

      dialogue.innerHTML = `The opponent has ${enemyHealth} hp left`;
      await wait(2000);

      //all functions print move verificaiton, and wait after the turn so we can immediately go ahead and process enemy turn.
      //TODO: ALSO, we need to eval if enemy is dead at the end of the turn
      enemyTurn();
      await wait(2000);

      if (health <= 0) {
        dialogue.innerHTML = 'You have lost all of your health, you have fainted.';
        battleWinner = false;
        printShit('#returntomain');
        clickOverlay.style.pointerEvents = 'auto';
        break;
      }

      health = kevin.hp;
      magic = kevin.mp;
      dialogue.innerHTML = `You have ${health} hp and ${magic} mp. What will you do?`;
      const moves = getMoves();
      printShit(`#choicemenu ${moves}`);

      break;
  }
}

//Enemy name is store in var enemyName. If more fight scenes are added, use that variable to select a move.
//Select a random move from enemies moveset.
function enemyTurn() {
  const moves = ['Fuck-Kevin-Smash', '나는 어린 남자아이들을 강간한다', 'Our Glorious Leader'];
  const move = Math.floor(Math.random() * 3);

  dialogue.innerHTML = `The opponent used ${moves[move]}.`;

  const moveFunc = enemyMoveMap.get(moves[move]);
  if (moveFunc === undefined) {
    dialogue.innerHTML = 'Error: shiiiiii idk.';
    return;
  }

  if (chanceToMiss > 0) {
    const rand = Math.floor(Math.random() * 100);
    if (chanceToMiss > rand) {
      dialogue.innerHTML = `The opponent used ${moves[move]}, however, the attack missed!`;
      return;
    }
    console.log(`Chance to miss: ${chanceToMiss}\nRandom number (if lower, miss): ${rand}`);
  }

  moveFunc();
  dialogue.innerHTML = `Opponent used ${moves[move]}`;
}

//Dates are indexes in the lore array, return one then store the returned date so it is not reused
function selectRandomDate(tier) {
  if (tier === 5) {
    //Do not redo dates
    if (completedDates.has(2)) {
      printShit('Léon: Monsiuer, you have no more dates available at this tier, you\'ll have to select another amount. #sprite=leon');
      printShit('#choicemenu blackjack dates store tip-dealer');
      return;
    }
    completedDates.add(2);

    let balanceAmount = balance.innerHTML.match(/(\d+)/);
    let bal = Number(balanceAmount[0]);
    balance.innerHTML = "Balance: " + (bal - 5);

    return 2; //for now as long as there is one date.
  } else if (tier === 50) {
    completedDates.add(3);

    let balanceAmount = balance.innerHTML.match(/(\d+)/);
    let bal = Number(balanceAmount[0]);
    balance.innerHTML = "Balance: " + (bal - tier);

    return 3;
  }
}

function validateDateEligibility(cost) {
  cost += 5;
  let balanceAmount = balance.innerHTML.match(/(\d+)/);
  let bal = Number(balanceAmount[0]);

  if (cost > bal) {
    return false;
  }

  return true;
}

function adjustWager(change) {
  let balanceAmount = balance.innerHTML.match(/(\d+)/);
  let bal = Number(balanceAmount[0]);
  wager += change;
  if (wager > bal) {
    wager = bal;
  }
  if (wager < 5) {
    wager = 5;
  }
  //Tipping dealer needs to leave you enough money for at least one min bet
  if (tip && wager > bal - 5) {
    wager = bal - 5;
  }

  dialogue.innerHTML = 'Current wager: ' + wager;
  buttons = ['MAX', '⇈', '⇑', 'Enter', '⇓', '⇊', 'MIN'];
  renderbtn();
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
        playad('Brought to you by Benjamin Netanyahu INC.');
        break;
      case 'choicemenu':
        clickOverlay.style.pointerEvents = 'none';
        buttons = instructionSet.split(" ").slice(1);
        renderbtn();
        break;
      case 'displaybalance':
        balance.style.opacity = 1;
        break;
      //stat changes will have encoding where first char is the stat, second is incremenet or decrement, and 3rd is value
      //IE cm1 means courage minus 1
      case 'statchange':
        const name = keyVal[1]; //Event handler item purchased expects name, so must pass it a variable with that name
        document.dispatchEvent(new CustomEvent('item-purchased', {
          detail: { name }
        }));

        break;
      case 'branch':
        const instruction = keyVal[1];
        dateProcessInstruction(instruction);
        break;
      case 'returntomain':
        curr = mainStory;
        let text = curr.nextDialogue();
        if (text != 'Error: pussy') printShit(text);
        break;
    }
  });
}

//story instructions will be denoted by d_x_b_y where x and y are ints. it reads "date x branch y" where x signifies the date id
//from which the caller originates and branch signifies which branch to check on in that date. For example, date one has 
//2 branches, both checks on intelligence and then sets the dialogue plus outcome. The '_' is part of the syntax now because
//using regex for all this is kinda retarded.
function dateProcessInstruction(instruction) {
  const instructions = instruction.split('_');
  const funcIndex = Number(instructions[1]) - 1;
  const branch = instructions[3];

  dateInstructionCallArr[funcIndex](branch);
}

function backgroundMap() {
  let backgroundmap = new Map();

  //add backgrounds here
  backgroundmap.set('default', 'assets/vegasstrip.jpg');
  backgroundmap.set('epstein_casino', 'assets/epsteintemple.jpg');
  backgroundmap.set('casino', 'assets/blackingmyjack.jpg');
  backgroundmap.set('snoggle', 'assets/MrNetanyahuNose.png');
  backgroundmap.set('dump', 'assets/dump.jpg');
  backgroundmap.set('i15', 'assets/oldustytrail.jpg');
  backgroundmap.set('trashrace', 'assets/trashcarrace.png');
  backgroundmap.set('nascar', 'assets/syndromedown.jpg');
  backgroundmap.set('carcrash', 'assets/carcrash.jpg');
  backgroundmap.set('insidehibachi', 'assets/totallyfrhibachi.jpg');
  backgroundmap.set('outsidehibachi', 'assets/hibachioutside.png');
  backgroundmap.set('hibachigrill', 'assets/hiubachigrill.jpg');
  backgroundmap.set('thunderdome', 'assets/evilassrapeplace.jpg');

  return backgroundmap;
}

function spriteMap() {
  let spritemap = new Map();

  //add sprites here
  spritemap.set('none', 'assets/blank-image.png');
  spritemap.set('noah', 'assets/NoahsBarmitsvah.png');
  spritemap.set('leon', 'assets/woowooweewee.png');
  spritemap.set('benny', 'assets/MrNetanyahu.png');
  spritemap.set('jackson', 'assets/packson.png');
  spritemap.set('homeless', 'assets/homeless.png');
  spritemap.set('pissed', 'assets/angy.png');
  spritemap.set('host', 'assets/waiter.png');
  spritemap.set('cutenoah', 'assets/NoahsFemboyBarmitsvah.png');
  spritemap.set('hibachiman', 'assets/mynuts.png');
  spritemap.set('announcer', 'assets/poop.png');

  return spritemap;
}

//Builds all story objects and stores in array, lore
function storyBuilder() {
  //The story elements will have instructions past the #. IE 'story element #sprite=leon' where sprite=leon is an instruction.
  let init = [
    'In this game, you are broke as fuck. To solve this issue, like any reasonable man you decide to take everything you have to Las Vegas, your savings totalling to an overwhelming 3 dollars.',
    'Your goal is to take your femdom femboy boyfriend, Noah Buol, out on dates. The more money you spend on the dates, the better time Noah will have (because he is very materialistic) so factor that into your expenditures. #sprite=noah',
    'You\'re wandering the streets of Las Vegas trying to find a casino perfect for you and you stumble upon Little St James Island Casino & Resort, you recall hearing about it from your good friend Jeffery Goblinstein. You decide to go inside. #background=epstein_casino sprite=none',
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
    'Léon: Ahh oui! Ze name eez Léon, and I am not related to zat certain Resident Evil character, non! I am Fronch! Care to play, hmm? #sprite=leon',
    '#choicemenu blackjack dates store tip-dealer'
  ];
  lore.push(new story('init', init));

  let sniff = [
    'You feel a sense of dread approaching, shivers run down your spine. The floor goes quite. #sprite=none',
    'What appears to be some sort of pit boss approaches you. But... it couldn\'t be, this man seems to command much respect. And he\'s approaching... HERE?!',
    '???: Well well well Kevin, it\'s so nice to finally meet you.',
    'Netanyahu: I am owner of this fine establishment, Benjamin Netanyahu. Having a good hand boy? #sprite=benny',
    'You tremble, sweat pouring down you face "y-y-yes Mr. N-Netanyahu". You quake terribly. #sprite=none',
    'Netanyahu: Why don\'t I give you the customary Little St James Island Casino & Resort greeting, for a first time customer. #sprite=benny',
    'Netanyahu proceeds to bend over atop you and begins to sniff.',
    '**SNIFF SNIFF** OH YEAH *SNIFF SNORT SNIFF SNIFF* OH YEAH MOTHERFUCKER OH SHIT **SNEEEGLE SNORT SNIFF HURRGHARGH** URAAAAGGGGGHHHHHH #sprite=none background=snoggle',
    'Netanyahu: Boy howdy, I haven\'t had a good sniffin like that in quite a while. Hope to be seeing more of you sonny boy. #background=casino sprite=benny',
    'He leaves your table, but the fear has yet subsided. You feel as though your courage has fallen. #sprite=none statchange=cm1', //TODO: apply stat change here
    'Léon: Ahhh, you \'ave got a complimentary table sniff, what a wondrous gift! Now zen, shall we get back to eet?',
    '#choicemenu blackjack dates store tip-dealer'
  ];
  lore.push(new story('sniff', sniff));

  //Date 1
  //TODO: change jackson sprite to packson
  let trashRace = [
    'You walk out the back with Noah to try and find some onion rings in the trash to have for dinner. #background=dump',
    'As you exit out the back door, you finally find the trash can and you start digging in.',
    'As you unsuccessfully look for onion rings, you find some high quality garbage cardboard boxes. You look at them then call out to Noah.',
    'Kevin: Hey Noah! Look at these cardboard boxes! Wouldn’t these be perfect to drive down the interstate with?',
    'Noah looks miserable as he’s outside for the first time in 7 days. The vitamin D fiercely penetrating his pale white skin.',
    'Noah: I wanna play rivals, this is bullshit, fuck cardboard. #sprite=noah',
    'Kevin looks at the 5 dollars in his pocket and looks at Noah. #sprite=none',
    'Come on Noah! It\'ll be fun! Ill give you 5 dollars for a rivals skin if you do this with me.',
    'Noah looks on nervously but finds himself convinced by the 5 dollars.',
    'Noah: Alright, I’m in #sprite=noah',
    'As you look around for more parts for your vehicle you see a man approach.',
    '???: Hello there! I see you\'re building yourself a fine motor vehicle! #sprite=jackson',  //add jackson sprite
    'You get the feeling he wants to commandeer your boyfriend, that shit is not gonna fly. #sprite=none',
    'Kevin: Stay away you freak!',
    'The man backs up slightly then speaks.',
    '???: Hey hey, I’m not here for any nefarious reasons, i myself am a trash racer. I build these puppies for the homeless so they too can know the joys of street racing. #sprite=jackson',  //add jackson sprite
    'You look at him suspiciously, but your guard lowers. #sprite=none',
    'Kevin: Alright then, I wager you a race down I-15!',
    'You pull out some crumpled ones from your back pocket.',
    'Kevin: I wager these 5 dollars!',
    'Noah looks at you in shock, then pulls you aside.',
    'Noah: You’re going to bet my rivals money on something like this? You’re out of your mind! #sprite=noah',
    'Kevin: Don’t worry pookie wookie bear, I wouldn’t make a bet that I could lose. #sprite=none',
    'Noah: But you lost a bunch in the casino, and even more in the one we went to previously that left us with a measly 3 dollars. #sprite=noah',
    'Kevin: Alright alright, but when have I been wrong twice. #sprite=none',
    'You turn around and shake the mysterious mans hand.',
    'Kevin: You’re on chump.',
    '#branch=d_1_b_1', // Branch dialogue placeholder. The current thought is that we have the instruction be something that way we moderately append the switch statement IE 
    // #storyinstruction=d1b1 so we add storyinstruction to the switch and d1 means date 1, b1 means branch one, and it resolves from there. 
    // It could set curr to the branched path as a seperate story instruction (perhaps not in lore, although it may not be too bad to do so).
    'You and your enemy push your cars toward I-15 once you get set you find yourself in the presence of many onlookers who are forced to watch as you are blocking the road. The sound of their angry horns cheering you on as you and Noah enter your “vehicle.” #background=i15',
    'Packson: Your choice to challenge me was ill advised, Packson Jike has never known defeat. #sprite=jackson',
    'The homeless man you hired to start the race pulls up the green flag, a sign for you to be prepared. #sprite=homeless',
    'Homeless Bum: I GOT 3 THINGS TO SAY, GOD BLESS OUR TROOPS, GOD BLESS AMERICA, AND GENTLEMANNNNNNNNNNNNN START PEDDLINGGGGGGGGGGGGGGGG! #sprite=homeless',
    'The man drops the green flag and you go. #sprite=none',
    '#branch=d_1_b_2', // Branch dialogue placeholder
  ];

  lore.push(new story('trashRace', trashRace));

  //date 2
  let superfuck = [
    'You find yourself flush with cash, more than you’ve ever had in your life. 50 dollars to your name. You decide to treat Noah to something nice, a Hibachi grill.',
    '#branch=d_2_b_1',
    'This place looks nice, lets eat here. #background=outsidehibachi',
    'You walk into the Hibachi Grill where you meet the host. #background=insidehibachi',
    'Kevin: Hello there, a table for two please.',
    'The host examines your sweaty and exhausted state along with your wardrobe which consists of dirty rags and potato sacks, nonetheless, she allows you entry.',
    'Host: Right this way sir. #sprite=host',
    'You follow the host toward the massive grill where you see chefs making all kinds of an unknown asian food. Once you reach your table you sit down and are given a menu. #background=hibachigrill sprite=none',
    'You take your time to order as you look up towards the chef station you see someone you wished to never see again, the man who introduced you to Hibachi,  케빈은 개자식이야. You thought you’d never see him again after the airport incident…',
    'You try to hide your face so he doesn’t see you, as of now…it seems to be working. You can’t let Noah of your alleged involvement with terrorist organizations.',
    'You take a hard long look at the menu before looking over to order from your chef and you courageously choose the chicken tenders. Noah decides to get 그 빌어먹을 짐 which exceeds your budget of 50 dollars, but you can’t tell him no, just look at him! #sprite=cutenoah',
    'You receive your food from the chef, your chicken tenders cooked to perfection, and Noah’s massive fuckload of food ready for him to feast. You eat your chicken tenders in a normal timeframe, but you watch as Noah savors EACH. DAMN. BITE. It takes hours as the restaurant prepares to close.',
    'You receive your check and your eyes pop as you see it. 252.67. How will you pay that? You look around you, no one is there, the chef has stepped out. You feel like you can escape. You grab Noah, still stuffing his mouth ever so slowly and passionately. As you try to sneak out of this establishment.',
    'You reach the door and your home free. But wait! The host steps out and stops you! #background=insidehibachi',
    'Host: Sir! You haven’t paid your bill! #sprite=host',
    'You attempt to lie to the young and impressionable host.',
    'Kevin: I left the money on the table!',
    'The host is not THAT young and impressionable hes like 35!',
    'Host: No you didn’t! I looked at your table and your fat ass boyfriend who was preventing us from closing! Pay up or face our restaurant\'s wrath! #sprite=host',
    'You try to escape but you’re still tired from your 2 mile journey 3 hours ago. (Seriously?)',
    'The host easily catches you and brings you to the open floor.',
    'Host: I SUMMON OUR BEST FIGHTER HIBACHI MAN 케빈은 개자식이야 #sprite=host',
    'You tremble in fear as you hear the name of the one person you wished never to hear from again.',
    '케빈은 개자식이야: Kevin-san… We meet again, you betrayed me in South Korea. How dare you not take that important parcel on the plane. Airport security was digging in my ass for HOURS. I have yearned for the opportunity to be able to best you in combat. My time has finally arrived. #sprite=hibachiman',
    'You shake in fear as you are surrounded by many asian men whom you are unfamiliar with the exact ethnicity of.',
    'Kevin: Please 케빈은 개자식이야 I don’t wish to fight you today. I’ll take any parcel on a plane you wish. Just let me go!',
    '케빈은 개자식이야: No Kevin-san you must fight me in a fight till we close. One of us will be forced to work here without pay FOREVER and the other leaves in a 2012 Suzuki Samurai. #sprite=hibachiman',
    'You follow the asian men toward their kitchen as they take you downstairs. You walk out into a massive arena filled with tens of fans. They take you toward the ring in the center, Noah close in tow. #background=thunderdome sprite=none',
    'Noah is put in your corner as you are fitted with gloves and forced to take off your shirt and show off your bitch tits.',
    'A man is in the middle of the arena as a mic slowly goes down toward him.',
    'Announcer dude: For the tens in attendance and my mother watching on DirectTV Pay Per View. Ladies and gentleman from The El Chupacabra in Las Vegas. LLLLLLLLLLLLLLETS GET READY TO RUMBLEEEEEEEEEEEEEEEEEE. #sprite=announcer',
    'You hear a ding as 케빈은 개자식이야 approaches you fists up. A fight is occurring.',
    '#sprite=hibachiman branch=d_2_b_2',
    '#branch=d_2_b_3'
  ];
  lore.push(new story('superfuck', superfuck));
}
