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
  // console.log(target.position.viewAngle)
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

export function drawObjects({ game, objectType, context, images, offsetX, offsetY }) {
  Object.keys(game[objectType]).forEach(type => {
    game[objectType][type].forEach(object => {
      try {
        context.drawImage(
          images[objectType][object.name], 
          offsetX + object.x, 
          offsetY + object.y
        )
      } catch (e) {
        console.warn(images[objectType], object.name)
        console.log(e)
      }
    })
  })
}

export function drawBackground(context, canvas, color) {
  // drawRect(context, 0, 0, canvas.width, canvas.height, color)
}

export function drawWeapon({ weapon, context, target, center }) {
  // draw backup canvas shape
  weapon.offsets = weapon.getHitboxPoints({ weapon, context, target, center })
  weapon.draw({ weapon, context, offsets: weapon.offsets })

  // draw image
  // if (this.weaponImage) {
  //   const rotatedWeapon = rotateAndCache(this.weaponImage, this.player.position.viewAngle * (Math.PI / 180))
  //   context.drawImage(rotatedWeapon, this.centerX - this.weaponImage.height, this.centerY - this.weaponImage.height)
  // }
}

export function drawWeapons({ weapon, context, target, center }) {
  if (!weapon) return
  drawWeapon({
    weapon, 
    context, 
    target, 
    center
  })
}

export function scaleToWindow(canvas, backgroundColor) {
  var scaleX, scaleY, scale, center;

  //1. Scale the canvas to the correct size
  //Figure out the scale amount on each axis
  scaleX = window.innerWidth / canvas.offsetWidth;
  scaleY = window.innerHeight / canvas.offsetHeight;

  //Scale the canvas based on whichever value is less: `scaleX` or `scaleY`
  scale = Math.min(scaleX, scaleY);
  canvas.style.transformOrigin = "0 0";
  canvas.style.transform = "scale(" + scale + ")";

  //2. Center the canvas.
  //Decide whether to center the canvas vertically or horizontally.
  //Wide canvases should be centered vertically, and 
  //square or tall canvases should be centered horizontally
  if (canvas.offsetWidth > canvas.offsetHeight) {
    if (canvas.offsetWidth * scale < window.innerWidth) {
      center = "horizontally";
    } else {
      center = "vertically";
    }
  } else {
    if (canvas.offsetHeight * scale < window.innerHeight) {
      center = "vertically";
    } else {
      center = "horizontally";
    }
  }

  //Center horizontally (for square or tall canvases)
  var margin;
  if (center === "horizontally") {
    margin = (window.innerWidth - canvas.offsetWidth * scale) / 2;
    canvas.style.marginTop = 0 + "px";
    canvas.style.marginBottom = 0 + "px";
    canvas.style.marginLeft = margin + "px";
    canvas.style.marginRight = margin + "px";
  }

  //Center vertically (for wide canvases) 
  if (center === "vertically") {
    margin = (window.innerHeight - canvas.offsetHeight * scale) / 2;
    canvas.style.marginTop = margin + "px";
    canvas.style.marginBottom = margin + "px";
    canvas.style.marginLeft = 0 + "px";
    canvas.style.marginRight = 0 + "px";
  }

  //3. Remove any padding from the canvas  and body and set the canvas
  //display style to "block"
  canvas.style.paddingLeft = 0 + "px";
  canvas.style.paddingRight = 0 + "px";
  canvas.style.paddingTop = 0 + "px";
  canvas.style.paddingBottom = 0 + "px";
  canvas.style.display = "block";

  //4. Set the color of the HTML body background
  document.body.style.backgroundColor = backgroundColor;

  //Fix some quirkiness in scaling for Safari
  var ua = navigator.userAgent.toLowerCase();
  if (ua.indexOf("safari") != -1) {
    if (ua.indexOf("chrome") > -1) {
      // Chrome
    } else {
      // Safari
      //canvas.style.maxHeight = "100%";
      //canvas.style.minHeight = "100%";
    }
  }

  //5. Return the `scale` value. This is important, because you'll nee this value 
  //for correct hit testing between the pointer and sprites
  return scale;
}
