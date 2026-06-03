const title = new Image();
title.src = 'assets/title.png';

const kirkington = document.createElement('video');
let videoLoaded = false
kirkington.oncanplay = () => { videoLoaded = true; };
kirkington.src = 'assets/erika-kirk-kirk.mp4';
kirkington.autoplay = true;
kirkington.loop = true;

export function updateTitle(ctx, dt) {

}

export function drawTitle(ctx, canvas) {
    if (videoLoaded) {
        for (let x = 0; x < 1200; x += 250) {
            ctx.drawImage(kirkington, x, 200);
        }
    }
    ctx.drawImage(title, 0, 0, canvas.width, title.height);
}