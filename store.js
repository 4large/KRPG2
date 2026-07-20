const background = new Image();
background.src = 'assets/jorkinit.jpg';

const item = new Image();
item.src = 'assets/leave store.png';

const IMAGE_WIDTH = 600;
const IMAGE_HEIGHT = 400;

//Maps item names to description
const descMap = new Map([
    ['clav', 'A tier 3 Clavicular subscription. Your new found hero fills you with courage and rizz. Try his patented bone smashing!\nPrice: 50'],  //+2 courage +3 rizz -2 hp
    ['steroids', 'Couldn\'t tell you specifically what type of steroids they are but I was told they may cause infertility.\nPrice: 125'],   //+3 hp +2 stamina -3 mp -2 girthy thrust
    ['nord vpn', 'Prevents me from selling your information to the CCP. (Note browser cookies and SID are still shared with the NSA and Israel per the EULA).\nPrice: 25'],    //Does fuckall
    ['yarmulke', 'You\'re probably the only non jew here, makes you stand out like a sore thumb!\nPrice: 250'],  //Makes you jewish
    ['israeli flag body pillow', 'A thrust from heaven that would make zues himself weep\nPrice: 300'],  //+3 girthy thrust
    ['storm cosplay', 'Aye that would look pretty good on your femdom femboy boyfriend over there wouldn\'t it?\nPrice: 500'],   //Unlocks hidden date
    ['kitty cat :3', 'Cat named Shadow. Your femdom femboy boyfriend seems piqued by it.\nPrice: 125'],  //Puts cat on Noah's head, added to items.
    ['leave store', 'You cannot seriously be thinking about leaving, be so deadass.'],
    ['hentai game', 'Spooge Crusaders IV. I didn\'t particularly like the disregard for then events for the 3rd game but a fine sequel all in all.\nPrice: 80'], //+3 mp -2 stamina
    ['penis curling', 'Penis curling instruction tape, now on DVD!\nPrice: 100'],  //+5 dex -2 girthy thrust -2 courage
    ['mystery sludge', 'Idk where you found that dude, but like you can have it for free.\nPrice: FREE!']   //Decrements every stat by 1
]);

const dialogue = document.getElementById('dialogue-box');

export function drawStore(ctx, canvas) {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    try {
        ctx.drawImage(item, 250, 100, IMAGE_WIDTH, IMAGE_HEIGHT);
    } catch (error) {
        console.log('Image Url Broken.');
    }
}

export async function storeOptions() {
    await wait();
    //TODO: add items that give special moves
    renderBtns(['Clav', 'Steroids', 'Nord VPN', 'Yarmulke', 'Israeli Flag Body Pillow', 'Storm Cosplay', 'Kitty cat :3', 
        'Hentai Game', 'Penis Curling', 'Mystery Sludge', 'Leave Store'
    ]);    //Put items here as they are necessary for the story
}

function wait() {
    return new Promise((resolve) => setTimeout(resolve, 1250));
}

function renderBtns(buttons) {
    const sidebar = document.getElementById('choice-sidebar');
    sidebar.innerHTML = '';
    sidebar.style.display = 'flex';

    buttons.forEach(label => {
        const btn = document.createElement('button');
        btn.textContent = label;
        btn.className = 'choice-btn';

        btn.addEventListener('mouseover', displayItem);
        btn.addEventListener('click', processButton);
        btn.addEventListener('mouseout', () => {
            item.src = 'assets/leave store.png';
            dialogue.textContent = 'Welcome to Little Saint James Casino and Resorts Store plus Crack Den, now with a K-Mart! What can I get ya today?';
        });

        sidebar.appendChild(btn);
    });
}

function displayItem(e) {
    const name = (e.target.innerText || e.target.innerHTML).toLowerCase();
    dialogue.textContent = descMap.get(name);

    //For dynamic url resolution, all provided images must be png
    const url = 'assets/' + name + '.png';
    item.src = url;
}

//Make this to give items effects
function processButton(e) {
    clearButtons();
}

function clearButtons() {
    const sidebar = document.getElementById('choice-sidebar');
    sidebar.style.display = 'none';
    sidebar.innerHTML = '';
}