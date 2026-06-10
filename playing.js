import { story } from "./story.js";

const background = new Image();
background.src = 'assets/vegasstrip.jpg';

const dialogue = document.getElementById('dialogue-box');

let lore = [];
storyBuilder();

export function updatePlaying() {

}

export function drawPlaying(ctx, canvas) {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

}

function storyBuilder() {
    //lore.push(new story('init', ))
}