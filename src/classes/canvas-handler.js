import weapons from '../content/weapons.js'
import foods from '../content/foods.js'
import environmentObjects from '../content/environment-objects.js'
import { weaponRotationRate } from '../constants/index.js'
import { safeDo } from '../helpers/index.js'
import {
  drawBackground,
  drawRect,
  drawText,
  drawObjects,
  drawWeapons,
  loadImage, 
  reassignExtremeAngles, 
  shouldTurnClockwise, 
  turnWeapon 
} from '../helpers/canvas.js'
import {
  pickupHitDetection,
  weaponHitDetection
} from '../helpers/collision.js'


export default class CanvasHandler {
  constructor(game, player, location, p2pHandler, app) {
    this.game = game
    this.player = player
    this.p2pHandler = p2pHandler
    this.location = location
    this.app = app
    this.width = window.innerWidth
    this.height = window.innerHeight

    // this.canvas = document.createElement('canvas');
    // this.width = window.innerWidth;
    // this.height = window.innerHeight;

    this.playerWidth = 16
    this.playerHeight = 16
    this.centerX = this.width / 2
    this.centerY = this.height / 2
    this.player.position.x = this.location.startingX
    this.player.position.y = this.location.startingY

    this.leftBound = this.player.position.x - this.centerX
    this.rightBound = this.player.position.x + this.centerX
    this.topBound = this.player.position.y - this.centerY
    this.bottomBound = this.player.position.y + this.centerY

    this.offsetX = this.centerX - this.player.position.x
    this.offsetY = this.centerY - this.player.position.y

    this.player.position.viewAngle = 0

    this.keysPressed = {}
    this.keyUp = {}
    this.mouse = {
      x: 0,
      y: 0
    }

    // this.ctx = this.canvas.getContext('2d');

    // document.querySelector('#game').innerHTML = ""
    // document.querySelector('#game').appendChild(this.canvas)

    // this.app.focus()

    // this.canvas.addEventListener('mousemove', (e) => {
    //   this.mouse.x = e.clientX
    //   this.mouse.y = e.clientY
    // })
    
    document.addEventListener('keydown', (event) => {
      this.keysPressed[event.key] = true;
    });
    
    document.addEventListener('keyup', (event) => {
      this.keysPressed[event.key] = false;
      this.keyUp[event.key] = true;
    });

    this.backgroundImage = null
    this.playerImage = null
    this.weaponImage = null
    this.images = {}
    this.imagesLoaded = false
    this.getImages()
    

    this.backgroundColor = 'black'
    drawBackground(this.ctx, this.canvas, this.backgroundColor)

    // this.gameLoop()
  }

  async getImages(...imagesToLoad) {
    this.backgroundImage = await safeDo(loadImage, this.location.backgroundUrl)
    this.playerImage = await safeDo(loadImage, this.player.imageUrl)
    this.weaponImage = await loadImage(this.player.equipped.weapons.primary.imageUrl)
    
    this.images.pickups = {}
    this.images.envObjects = {}

    await Promise.all([].concat(
      Object.keys(foods).map(async (food) => {
        this.images.pickups[food] = await loadImage(foods[food].imageUrl)
        return this.images.pickups[food]
      }),
      Object.keys(environmentObjects).map(async (envObject) => {
        this.images.envObjects[envObject] = await loadImage(environmentObjects[envObject].imageUrl) 
        return this.images.envObjects[envObject]
      })
    ))
    this.imagesLoaded = true
  }

  drawLocation() {
    if (this.backgroundImage) {
      this.ctx.drawImage(this.backgroundImage, this.offsetX, this.offsetY)
    } else {
      drawRect(this.ctx, this.offsetX, this.offsetY, this.location.width, this.location.height, 'blue')
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
      drawRect(
        this.ctx, 
        (this.width / 2) - (this.playerWidth / 2), 
        (this.height / 2) - (this.playerHeight / 2), 
        this.playerWidth, 
        this.playerHeight, 
        this.player.data.color
      )
    }

    drawText(
      this.ctx,
      this.player.data.name,
      (this.width / 2) - (this.playerWidth / 2),
      (this.height / 2) - (this.playerHeight / 2) + 24,
      10,
      'white'
    )

    drawText(
      this.ctx,
      this.player.className,
      (this.width / 2) - (this.playerWidth / 2),
      (this.height / 2) - (this.playerHeight / 2) + 36,
      10,
      'white'
    )
  }

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
      drawRect(this.ctx, peerX, peerY, 16, 16, peer.color || 'white')

      if (peer.name) {
        drawText(
          this.ctx,
          peer.name,
          peerX,
          peerY + 24,
          10,
          'white'
        )
      }
      
      if (peer.className) {
        drawText(
          this.ctx,
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
          if (shouldTurnClockwise(peer.position.viewAngle + 180, actualAngle + 180)) {
            peer.position.viewAngle += change
          } else {
            peer.position.viewAngle -= change
          }
        }
        peer.position.viewAngle = reassignExtremeAngles(peer.position.viewAngle)
        
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
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
  
  

  update() {
    const currentAngle = this.player.position.viewAngle
    const playerMouseXDiff = (this.width / 2) - this.mouse.x
    const playerMouseYDiff = (this.height / 2) - this.mouse.y
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

    if (this.keyUp['1']) {
      // this.player.equipped.weapons.primary = this.player.inventory.weapons.primary[0]
      console.log('ONE')
      delete this.keyUp['1']
    }

    if (this.player.position.x - (this.playerWidth / 2) < 0) this.player.position.x = this.playerWidth / 2
    if (this.player.position.y - (this.playerHeight / 2) < 0) this.player.position.y = this.playerHeight / 2
    if (this.player.position.x + (this.playerWidth / 2) > this.location.width) this.player.position.x = this.location.width - this.playerWidth / 2
    if (this.player.position.y + (this.playerWidth / 2) > this.location.height) this.player.position.y = this.location.height - this.playerHeight / 2

    this.leftBound = this.player.position.x - this.centerX
    this.rightBound = this.player.position.x + this.centerX
    this.topBound = this.player.position.y - this.centerY
    this.bottomBound = this.player.position.y + this.centerY
    
    this.p2pHandler.peerList.forEach(peerId => {
      const peer = this.p2pHandler.peerList[peerId]
    })

    this.offsetX = this.centerX - this.player.position.x
    this.offsetY = this.centerY - this.player.position.y

    this.hitDetection()
  }

  hitDetection() {
    pickupHitDetection({
      objects: this.game.pickups,
      player: this.player,
      offsetX: this.offsetX,
      offsetY: this.offsetY,
      center: { x: this.centerX, y: this.centerY },
      game: this.game
    })
    weaponHitDetection({ 
      objects: this.game.envObjects, 
      player: this.player, 
      offsetX: this.offsetX, 
      offsetY: this.offsetY, 
      center: { x: this.centerX, y: this.centerY },
      game: this.game 
    })
  //   this.playerHitDetection()
  //   this.peerHitDetection()
  }

  gameLoop() {
    this.update();

    this.ctx.clearRect(0, 0, this.width, this.height);
    const drawData = {
      context: this.ctx,
      images: this.images,
      offsetX: this.offsetX,
      offsetY: this.offsetY
    }

    drawBackground(this.ctx, this.canvas, this.backgroundColor);
    this.drawLocation();

    if (this.imagesLoaded) {
      drawObjects({
        game: this.game,
        objectType: 'envObjects', 
        ...drawData
      })
      drawObjects({
        game: this.game,
        objectType: 'pickups', 
        ...drawData
      })
    }

    this.drawPlayer();
    this.drawPeers();
    drawWeapons({
      weapon: this.player.equipped.weapons.primary,
      context: this.ctx,
      target: this.player,
      center: { x: this.centerX, y: this.centerY }
    });
    window.requestAnimationFrame(this.gameLoop.bind(this));
  }
}
