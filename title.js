const title = new Image();
title.src = 'assets/title.png';

const kirkington = document.createElement('video');
kirkington.muted = true;
const gayJimmy = new Audio('assets/KRPG2 OFFICIAL SOUNDTRACK DELUXE 1/IJUSTHITTHEJACKPOTTTTTTT.mp3');
gayJimmy.loop = true;

const UNLOCK_EVENTS = ['pointerdown', 'click', 'keydown', 'touchend'];
let titleActive = true;

function addUnlockListeners() {
    UNLOCK_EVENTS.forEach((evt) => document.addEventListener(evt, onUserGesture));
}

function removeUnlockListeners() {
    UNLOCK_EVENTS.forEach((evt) => document.removeEventListener(evt, onUserGesture));
}

function onUserGesture() {
    // The start button click also bubbles up to the document, don't restart the music then.
    if (!titleActive) {
        removeUnlockListeners();
        return;
    }
    Promise.all([gayJimmy.play(), kirkington.play()]).then(() => {
        removeUnlockListeners();
    }).catch((err) => {
        if (err.name !== 'NotAllowedError' && err.name !== 'AbortError') {
            console.warn('Title audio/video failed to play:', err);
        }
    });
}

addUnlockListeners();
let videoLoaded = false
kirkington.oncanplay = () => { videoLoaded = true; };
kirkington.src = 'assets/erika-kirk-kirk.mp4';
kirkington.loop = true;
let startbtn = document.getElementById('startbtn');
startbtn.addEventListener("click", (e) => {
    startbtn.style.display = 'none';
    titleActive = false;
    removeUnlockListeners();
    gayJimmy.pause();
    document.dispatchEvent(new CustomEvent('buttonPressed', {
        detail: { myVar: true }
    }));
});

export function drawTitle(ctx, canvas) {
    if (videoLoaded) {
        for (let x = 0; x < 1200; x += 250) {
            ctx.drawImage(kirkington, x, 200);
        }
    }
    ctx.drawImage(title, 0, 0, canvas.width, title.height);
}