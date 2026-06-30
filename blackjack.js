const img = new Image();
img.src = 'assets/blank-image.png';

export function drawBlackJack(ctx, canvas) {
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

}
