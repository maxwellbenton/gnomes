export default class CanvasHandler {
  constructor(game, player, location, p2pHandler) {
    this.game = game
    this.player = player
    this.p2pHandler = p2pHandler
    this.location = location

    this.canvas = document.createElement('canvas');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.offsetX = 0
    this.offsetY = 0

    this.playerWidth = 16
    this.playerHeight = 16
    this.centerX = this.canvas.width / 2
    this.centerY = this.canvas.height / 2
    this.player.position.x = this.centerX - (this.playerWidth / 2)
    this.player.position.y = this.centerY - (this.playerHeight / 2)

    this.player.position.x = this.location.startingX
    this.player.position.y = this.location.startingY

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

    this.backgroundColor = 'black'
    this.drawBackground()

    // this.gameLoop()
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
    // given a players position on a map, draw the map so that the player is in the middle
    
    this.offsetX = this.centerX - this.player.position.x
    this.offsetY = this.centerY - this.player.position.y
    // console.log('drawing location', offsetX, offsetY)
    this.drawRect(this.offsetX, this.offsetY, this.location.width, this.location.height, 'blue')
  }

  drawPlayer() {
    this.drawRect(
      (this.canvas.width / 2) - (this.playerWidth / 2), 
      (this.canvas.height / 2) - (this.playerHeight / 2), 
      this.playerWidth, 
      this.playerHeight, 
      this.player.data.color
    )

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

  drawWeapons() {
    Object.keys(this.player.equipped.weapons).forEach(type => {
      if (!this.player.equipped.weapons[type]) return
      this.player.equipped.weapons[type].draw(this.ctx, this.player, type, {x: this.canvas.width / 2, y: this.canvas.height / 2})
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
      if (!this.player.acquaintances[peerId]) return
      // console.log('drawing peer', this.player.acquaintances[peerId])
      
      const peer = this.player.acquaintances[peerId]
      if (!peer || !peer.position) return
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
    })
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  update() {
    // this.player.position.movementDirection.x = 0
    // this.player.position.movementDirection.y = 0

    const playerMouseXDiff = (this.canvas.width / 2) - this.mouse.x
    const playerMouseYDiff = (this.canvas.height / 2) - this.mouse.y
    this.player.position.viewAngle = Math.atan2(playerMouseYDiff, playerMouseXDiff) * 180 / Math.PI
    // console.log(this.player.position.x, this.player.position.y)
    let xDiff = 0
    let yDiff = 0
    if (this.keysPressed['w'] || this.keysPressed['ArrowUp']) {
      yDiff += 1 * this.player.stats.speed
      this.player.position.y -= 1 * this.player.stats.speed
      // this.player.position.movementDirection.y = -1
    }
    if (this.keysPressed['s'] || this.keysPressed['ArrowDown']) {
      yDiff -= 1 * this.player.stats.speed
      this.player.position.y += 1 * this.player.stats.speed
      // this.player.position.movementDirection.y = 1
    }
    if (this.keysPressed['a'] || this.keysPressed['ArrowLeft']) {
      xDiff += 1 * this.player.stats.speed
      this.player.position.x -= 1 * this.player.stats.speed
      // this.player.position.movementDirection.x = -1
    }
    if (this.keysPressed['d'] || this.keysPressed['ArrowRight']) {
      xDiff -= 1 * this.player.stats.speed
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

    // Object.keys(this.game.items).forEach(itemName => {
    //   this.game.items[itemName].forEach(item => {
    //     item.position.rx += xDiff
    //     item.position.ry += yDiff
    //   })
    // })
  }

  gameLoop() {
    this.update();
    // console.log(this.game.items)
    // Clear the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawBackground();
    this.drawLocation();
    // this.drawItems();
    this.drawWeapons();
    this.drawPlayer();
    this.drawPeers();
    window.requestAnimationFrame(this.gameLoop.bind(this));
  }
}