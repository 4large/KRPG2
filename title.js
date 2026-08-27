const title = new Image();
title.src = 'assets/title.png';

const kirkington = document.createElement('video');
const gayJimmy = new Audio('assets/KRPG2 OFFICIAL SOUNDTRACK DELUXE 1/IJUSTHITTHEJACKPOTTTTTTT.mp3');
gayJimmy.addEventListener('canplaythrough', () => {
    gayJimmy.loop = true;
    gayJimmy.play();
});
let videoLoaded = false
kirkington.oncanplay = () => { videoLoaded = true; };
kirkington.src = 'assets/erika-kirk-kirk.mp4';
kirkington.autoplay = true;
kirkington.loop = true;
let startbtn = document.getElementById('startbtn');
//Custom event callback to game that allows us to send vars back to game.
startbtn.addEventListener("click", (e) => {
    startbtn.style.visibility = 'hidden';
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