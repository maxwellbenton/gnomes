import weapons from '../content/weapons.js'
import { weaponRotationRate } from '../constants/index.js'

async function loadImage(filePath) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = function () {
      resolve(img)
    };
  
    img.src = filePath;
  })
}

function turnClockwise(alpha, beta) {
  const delta = 360 - alpha
  beta = beta + delta
  beta = beta % 360
  return beta < 180 ? true : false
}

function turnWeapon(target, currentAngle, actualAngle, change) {
  if (Math.abs(currentAngle - actualAngle) < change || Math.abs(actualAngle - currentAngle) < change) {
    target.position.viewAngle = actualAngle
  } else {
    if (turnClockwise(currentAngle + 180, actualAngle + 180)) {
      target.position.viewAngle += change
    } else {
      target.position.viewAngle -= change
    }
  }
  
  if (target.position.viewAngle > 180) target.position.viewAngle -= 360
  if (target.position.viewAngle < -180) target.position.viewAngle += 360
}

export default class CanvasHandler {
  constructor(game, player, location, p2pHandler) {
    this.game = game
    this.player = player
    this.p2pHandler = p2pHandler
    this.location = location

    this.canvas = document.createElement('canvas');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.playerWidth = 16
    this.playerHeight = 16
    this.centerX = this.canvas.width / 2
    this.centerY = this.canvas.height / 2
    this.player.position.x = this.centerX - (this.playerWidth / 2)
    this.player.position.y = this.centerY - (this.playerHeight / 2)

    this.player.position.x = this.location.startingX
    this.player.position.y = this.location.startingY

    this.offsetX = this.centerX - this.player.position.x
    this.offsetY = this.centerY - this.player.position.y

    this.player.position.viewAngle = 0


    this.keysPressed = {}
    this.mouse = {
      x: 0,
      y: 0
    }

    this.ctx = this.canvas.getContext('2d');

    document.querySelector('#game').innerHTML = ""
    document.querySelector('#game').appendChild(this.canvas)

    this.canvas.focus()

    this.canvas.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX
      this.mouse.y = e.clientY
    })

    
    
    document.addEventListener('keydown', (event) => {
      this.keysPressed[event.key] = true;
    });
    
    document.addEventListener('keyup', (event) => {
      this.keysPressed[event.key] = false;
    });

    this.backgroundImage = null
    this.playerImage = null
    this.weaponImage = null

    this.getImages()
    

    this.backgroundColor = 'black'
    this.drawBackground()

    // this.gameLoop()
  }

  rotateAndCache(image, angle) {
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

  async getImages(...imagesToLoad) {
    this.backgroundImage = await loadImage(this.location.backgroundUrl)
    this.playerImage = await loadImage(this.player.imageUrl)
    this.weaponImage = await loadImage(this.player.equipped.weapons.primary.imageUrl)
  }

  drawRect(x, y, width, height, color) {
    this.ctx.beginPath();
    this.ctx.fillStyle = color
    this.ctx.fillRect(x, y, width, height);

    this.ctx.fill();
    
  }

  drawText(text, x, y, size, color) {
    this.ctx.fillStyle = color;
    this.ctx.font = `${size}px Arial`;
    this.ctx.fillText(text, x, y);
  }

  drawBackground() {
    this.drawRect(0, 0, this.canvas.width, this.canvas.height, this.backgroundColor)
  }

  drawLocation() {
    if (this.backgroundImage) {
      this.ctx.drawImage(this.backgroundImage, this.offsetX, this.offsetY)
    } else {
      this.drawRect(this.offsetX, this.offsetY, this.location.width, this.location.height, 'blue')
    }
  }

  drawPlayer() {
    if (this.playerImage) {
      switch (true) {
        case (this.player.position.viewAngle < -135):
          // right
          this.ctx.drawImage(
            this.playerImage, 
            80,
            0,
            16,
            30,
            this.centerX - (this.playerWidth / 2), 
            this.centerY - (this.playerHeight / 2) - 14,
            16,
            30
          )
          break
        case (this.player.position.viewAngle < -90):
          // down/right
          this.ctx.drawImage(
            this.playerImage, 
            48,
            30,
            16,
            30,
            this.centerX - (this.playerWidth / 2), 
            this.centerY - (this.playerHeight / 2) - 14,
            this.playerWidth,
            this.playerHeight + 14
          )
          break
        case (this.player.position.viewAngle < -45):
          // down/left
          this.ctx.drawImage(
            this.playerImage, 
            48,
            0,
            16,
            30,
            this.centerX - (this.playerWidth / 2), 
            this.centerY - (this.playerHeight / 2) - 14,
            this.playerWidth,
            this.playerHeight + 14
          )
          break
        case (this.player.position.viewAngle < 45):
          // left
          this.ctx.drawImage(
            this.playerImage, 
            80,
            30,
            16,
            30,
            this.centerX - (this.playerWidth / 2), 
            this.centerY - (this.playerHeight / 2) - 14,
            this.playerWidth,
            this.playerHeight + 14
          )
          break
        case (this.player.position.viewAngle < 90):
          // up/left
          this.ctx.drawImage(
            this.playerImage, 
            64,
            0,
            16,
            30,
            this.centerX - (this.playerWidth / 2), 
            this.centerY - (this.playerHeight / 2) - 14,
            this.playerWidth,
            this.playerHeight + 14
          )
          break
        case (this.player.position.viewAngle < 135):
          // up/right
          this.ctx.drawImage(
            this.playerImage, 
            64,
            30,
            16,
            30,
            this.centerX - (this.playerWidth / 2), 
            this.centerY - (this.playerHeight / 2) - 14,
            this.playerWidth,
            this.playerHeight + 14
          )
          break
        case (this.player.position.viewAngle <= 180):
          this.ctx.drawImage(
            this.playerImage, 
            80,
            0,
            16,
            30,
            this.centerX - (this.playerWidth / 2), 
            this.centerY - (this.playerHeight / 2) - 14,
            16,
            30
          )
          break
        default:
          this.ctx.drawImage(
            this.playerImage, 
            48,
            0,
            16,
            30,
            this.centerX - (this.playerWidth / 2), 
            this.centerY - (this.playerHeight / 2) - 14,
            this.playerWidth,
            this.playerHeight + 14
          )
      }
    } else {
      this.drawRect(
        (this.canvas.width / 2) - (this.playerWidth / 2), 
        (this.canvas.height / 2) - (this.playerHeight / 2), 
        this.playerWidth, 
        this.playerHeight, 
        this.player.data.color
      )
    }

    this.drawText(
      this.player.data.name,
      (this.canvas.width / 2) - (this.playerWidth / 2),
      (this.canvas.height / 2) - (this.playerHeight / 2) + 24,
      10,
      'white'
    )

    this.drawText(
      this.player.className,
      (this.canvas.width / 2) - (this.playerWidth / 2),
      (this.canvas.height / 2) - (this.playerHeight / 2) + 36,
      10,
      'white'
    )
  }

  drawEnemies() {
    Object.keys(this.game.enemies).forEach(enemyName => {
      const enemyGroup = this.game.enemies[enemyName]
      enemyGroup.forEach(enemy => {
        this.drawRect(
          this.offsetX + enemy.x, 
          this.offsetY + enemy.y, 
          16, 
          16, 
          'red'
        )
      })
    })
  }

  drawWeapon({ weapon, context, target, center }) {
    weapon.draw({ weapon, context, target, center })
    if (this.weaponImage) {
      const rotatedWeapon = this.rotateAndCache(this.weaponImage, this.player.position.viewAngle * (Math.PI / 180))
      context.drawImage(rotatedWeapon, this.centerX - this.weaponImage.height, this.centerY - this.weaponImage.height)
    }
  }

  drawWeapons() {
    Object.keys(this.player.equipped.weapons).forEach(type => {
      if (!this.player.equipped.weapons[type]) return
      const weapon = this.player.equipped.weapons[type]
      this.drawWeapon({
        weapon, 
        context: this.ctx, 
        target: this.player, 
        center: {x: this.canvas.width / 2, y: this.canvas.height / 2}
      })
    })
  }

  // drawItems() {
  //   Object.keys(this.game.items).forEach(itemName => {
  //     this.game.items[itemName].forEach(item => {
  //       this.drawRect((this.canvas.width / 2) + item.position.rx, (this.canvas.height / 2) + item.position.ry, 5, 5, 'red')
  //     })
  //   })
  // }

  drawPeers() {
    if (!this.p2pHandler.peerList.length) return
    this.p2pHandler.peerList.forEach(peerId => {
      if (!this.player.acquaintances[peerId] 
        || this.player.acquaintances[peerId].connecting
        || !this.player.acquaintances[peerId].connection
      ) return

      // console.log('drawing peer', this.player.acquaintances[peerId])
      
      const peer = this.player.acquaintances[peerId]
      if (!peer || !peer.newPosition) return
      if (!peer.position) peer.position = peer.newPosition
      if (peer.newPosition.x !== peer.position.x || peer.newPosition.y !== peer.position.y) {
        const distance = peer.stats.speed
        if (peer.newPosition.x > peer.position.x) {
          peer.position.x += distance
        }
        if (peer.newPosition.x < peer.position.x) {
          peer.position.x -= distance
        }
        if (peer.newPosition.y > peer.position.y) {
          peer.position.y += distance
        }
        if (peer.newPosition.y < peer.position.y) {
          peer.position.y -= distance
        }
      }

      const peerX = this.offsetX + peer.position.x
      const peerY = this.offsetY + peer.position.y
      this.drawRect(peerX, peerY, 16, 16, peer.color || 'white')

      if (peer.name) {
        this.drawText(
          peer.name,
          peerX,
          peerY + 24,
          10,
          'white'
        )
      }
      
      if (peer.className) {
        this.drawText(
          peer.className,
          peerX,
          peerY + 36,
          10,
          'white'
        )
      }
      
      if (peer.weapon) {
        if (!weapons[peer.weapon.name]) {
          console.warn('Peer has weapon that does not exist', peer.weapon.name)
          return
        }
        


        peer.position.viewAngle
        const actualAngle = peer.newPosition.viewAngle
        const change = peer.stats.strength / peer.weapon.weight * weaponRotationRate

        if (Math.abs(peer.position.viewAngle - actualAngle) < change || Math.abs(actualAngle - peer.position.viewAngle) < change) {
          peer.position.viewAngle = actualAngle
        } else {
          if (turnClockwise(peer.position.viewAngle + 180, actualAngle + 180)) {
            peer.position.viewAngle += change
          } else {
            peer.position.viewAngle -= change
          }
        }
        if (peer.position.viewAngle > 180) peer.position.viewAngle -= 360
        if (peer.position.viewAngle < -180) peer.position.viewAngle += 360
        
        peer.weapon.draw = weapons[peer.weapon.name].draw
        this.drawWeapon({ 
          weapon: peer.weapon, 
          context: this.ctx, 
          target: peer, 
          center: { x: this.offsetX + peer.position.x + (this.playerWidth / 2), y: this.offsetY + peer.position.y + (this.playerHeight / 2) } 
        })
      }
    })
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
  

  update() {
    const currentAngle = this.player.position.viewAngle
    const playerMouseXDiff = (this.canvas.width / 2) - this.mouse.x
    const playerMouseYDiff = (this.canvas.height / 2) - this.mouse.y
    const actualAngle = Math.atan2(playerMouseYDiff, playerMouseXDiff) * 180 / Math.PI
    const change = this.player.stats.strength / this.player.equipped.weapons.primary.weight * weaponRotationRate
    
    turnWeapon(this.player, currentAngle, actualAngle, change)

    let xDiff = 0
    let yDiff = 0
    if (this.keysPressed['w'] || this.keysPressed['ArrowUp']) {
      this.player.position.y -= 1 * this.player.stats.speed
      // this.player.position.movementDirection.y = -1
    }
    if (this.keysPressed['s'] || this.keysPressed['ArrowDown']) {
      this.player.position.y += 1 * this.player.stats.speed
      // this.player.position.movementDirection.y = 1
    }
    if (this.keysPressed['a'] || this.keysPressed['ArrowLeft']) {
      this.player.position.x -= 1 * this.player.stats.speed
      // this.player.position.movementDirection.x = -1
    }
    if (this.keysPressed['d'] || this.keysPressed['ArrowRight']) {
      this.player.position.x += 1 * this.player.stats.speed
      // this.player.position.movementDirection.x = 1
    }

    if (this.player.position.x - (this.playerWidth / 2) < 0) this.player.position.x = this.playerWidth / 2
    if (this.player.position.y - (this.playerHeight / 2) < 0) this.player.position.y = this.playerHeight / 2
    if (this.player.position.x + (this.playerWidth / 2) > this.location.width) this.player.position.x = this.location.width - this.playerWidth / 2
    if (this.player.position.y + (this.playerWidth / 2) > this.location.height) this.player.position.y = this.location.height - this.playerHeight / 2

    this.p2pHandler.peerList.forEach(peerId => {
      const peer = this.p2pHandler.peerList[peerId]
    })

    this.offsetX = this.centerX - this.player.position.x
    this.offsetY = this.centerY - this.player.position.y
  }

  enemyHitDetection() {
    Object.keys(this.game.enemies).forEach(enemyId => {
      this.game.enemies[enemyId].forEach(enemy => {
        
      })
    })
  }

  hitDetection() {
    this.enemyHitDetection()
  //   this.playerHitDetection()
  //   this.peerHitDetection()
  }

  gameLoop() {
    this.update();
    this.hitDetection()
    // console.log(this.game.items)
    // Clear the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawBackground();
    this.drawLocation();
    this.drawEnemies();
    this.drawPlayer();
    this.drawPeers();
    this.drawWeapons();
    window.requestAnimationFrame(this.gameLoop.bind(this));
  }
}