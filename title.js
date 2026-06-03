const title = new Image();
title.src = 'assets/title.png';

export function updateTitle(ctx, dt) {
  
}

export function drawTitle(ctx, canvas) {
  ctx.drawImage(title, 0, 0, canvas.width, title.height);
}