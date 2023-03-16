export function reassignExtremeAngles(angle) {
  if (angle > -180 && angle <= 180) return angle
  if (angle < -180) angle += 360
  if (angle > 180) angle -= 360
  return angle
}

export async function loadImage(filePath) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = function () {
      resolve(img)
    };
  
    img.src = filePath;
  })
}

export function shouldTurnClockwise(alpha, beta) {
  const delta = 360 - alpha
  beta = beta + delta
  beta = beta % 360
  return beta < 180 ? true : false
}

export function turnWeapon(target, currentAngle, actualAngle, change) {
  if (Math.abs(currentAngle - actualAngle) < change || Math.abs(actualAngle - currentAngle) < change) {
    target.position.viewAngle = actualAngle
  } else {
    if (shouldTurnClockwise(currentAngle + 180, actualAngle + 180)) {
      target.position.viewAngle += change
    } else {
      target.position.viewAngle -= change
    }
  }

  target.position.viewAngle = reassignExtremeAngles(target.position.viewAngle)
}

export function rotateAndCache(image, angle) {
  var offscreenCanvas = document.createElement('canvas');
  var offscreenCtx = offscreenCanvas.getContext('2d');

  var size = Math.max(image.width, image.height) * 2;
  offscreenCanvas.width = size;
  offscreenCanvas.height = size;

  offscreenCtx.translate(size/2, size/2);
  offscreenCtx.rotate(angle + Math.PI/2);
  offscreenCtx.drawImage(image, -(image.width/2), 0);

  return offscreenCanvas;
}

export function drawRect(context, x, y, width, height, color) {
  context.beginPath();
  context.fillStyle = color
  context.fillRect(x, y, width, height);

  context.fill();
}

export function drawText(context, text, x, y, size, color) {
  context.fillStyle = color;
  context.font = `${size}px Arial`;
  context.fillText(text, x, y);
}