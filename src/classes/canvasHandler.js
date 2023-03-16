import weapons from '../content/weapons.js'
import foods from '../content/foods.js'
import environmentObjects from '../content/environment-objects.js'
import { weaponRotationRate } from '../constants/index.js'
import Pickup from './pickup.js'
import { generatePickupData } from '../helpers/generators.js'
import { safeDo } from '../helpers/index.js'
import {
  drawRect,
  drawText,
  loadImage, 
  reassignExtremeAngles, 
  rotateAndCache,
  shouldTurnClockwise, 
  turnWeapon 
} from '../helpers/canvas.js'


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
    this.images = {}
    this.imagesLoaded = false
    this.getImages()
    

    this.backgroundColor = 'black'
    this.drawBackground()

    // this.gameLoop()
  }

  async getImages(...imagesToLoad) {
    this.backgroundImage = await safeDo(loadImage, this.location.backgroundUrl)
    this.playerImage = await safeDo(loadImage, this.player.imageUrl)
    this.weaponImage = await loadImage(this.player.equipped.weapons.primary.imageUrl)
    
    this.images.foods = {}
    this.images.envObjects = {}

    await Promise.all([].concat(
      Object.keys(foods).map(async (food) => {
        this.images.foods[food] = await loadImage(foods[food].imageUrl)
        return this.images.foods[food]
      }),
      Object.keys(environmentObjects).map(async (envObject) => {
        this.images.envObjects[envObject] = await loadImage(environmentObjects[envObject].imageUrl) 
        return this.images.envObjects[envObject]
      })
    ))
    this.imagesLoaded = true
  }

  drawBackground() {
    this.drawRect(this.ctx, 0, 0, this.canvas.width, this.canvas.height, this.backgroundColor)
  }

  drawLocation() {
    if (this.backgroundImage) {
      this.ctx.drawImage(this.backgroundImage, this.offsetX, this.offsetY)
    } else {
      this.drawRect(this.ctx, this.offsetX, this.offsetY, this.location.width, this.location.height, 'blue')
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
        this.ctx, 
        (this.canvas.width / 2) - (this.playerWidth / 2), 
        (this.canvas.height / 2) - (this.playerHeight / 2), 
        this.playerWidth, 
        this.playerHeight, 
        this.player.data.color
      )
    }

    this.drawText(
      this.ctx,
      this.player.data.name,
      (this.canvas.width / 2) - (this.playerWidth / 2),
      (this.canvas.height / 2) - (this.playerHeight / 2) + 24,
      10,
      'white'
    )

    this.drawText(
      this.ctx,
      this.player.className,
      (this.canvas.width / 2) - (this.playerWidth / 2),
      (this.canvas.height / 2) - (this.playerHeight / 2) + 36,
      10,
      'white'
    )
  }

  drawEnvObjects() {
    if (this.imagesLoaded) {
      // console.warn('1')
      Object.keys(this.game.envObjects).forEach(envObjectType => {
        // console.warn('2', this.game.envObjects, envObjectType)
        this.game.envObjects[envObjectType].forEach(envObject => {
          try {
            this.ctx.drawImage(
              this.images.envObjects[envObject.name], 
              this.offsetX + envObject.x, 
              this.offsetY + envObject.y
            )
          } catch (e) { console.error(e) }
        })
      })
    }
  }

  drawPickups() {
    if (this.imagesLoaded) {
      Object.keys(this.game.pickups).forEach(pickupType => {
        this.game.pickups[pickupType].forEach(pickup => {
          this.ctx.drawImage(
            this.images.foods[pickup.name], 
            this.offsetX + pickup.x, 
            this.offsetY + pickup.y
          )
        })
      })
    }
  }

  drawWeapon({ weapon, context, target, center }) {
    // draw backup canvas shape
    weapon.offsets = weapon.getHitboxPoints({ weapon, context, target, center })
    weapon.draw({ weapon, context, offsets: weapon.offsets })

    // draw image
    // if (this.weaponImage) {
    //   const rotatedWeapon = rotateAndCache(this.weaponImage, this.player.position.viewAngle * (Math.PI / 180))
    //   context.drawImage(rotatedWeapon, this.centerX - this.weaponImage.height, this.centerY - this.weaponImage.height)
    // }
  }

  drawWeapons() {
    if (!this.player.equipped.weapons.primary) return
    const weapon = this.player.equipped.weapons.primary
    this.drawWeapon({
      weapon, 
      context: this.ctx, 
      target: this.player, 
      center: { x: this.canvas.width / 2, y: this.canvas.height / 2 }
    })
  }

  // drawItems() {
  //   Object.keys(this.game.items).forEach(itemName => {
  //     this.game.items[itemName].forEach(item => {
  //       this.drawRect(this.ctx, (this.canvas.width / 2) + item.position.rx, (this.canvas.height / 2) + item.position.ry, 5, 5, 'red')
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
      this.drawRect(this.ctx, peerX, peerY, 16, 16, peer.color || 'white')

      if (peer.name) {
        this.drawText(
          this.ctx,
          peer.name,
          peerX,
          peerY + 24,
          10,
          'white'
        )
      }
      
      if (peer.className) {
        this.drawText(
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

    this.hitDetection()
  }

  pickupHitDetection() {
    Object.keys(this.game.pickups).forEach(pickupId => {
      this.game.pickups[pickupId].forEach(pickup => {
        const pickupX = this.offsetX + pickup.x
        const pickupY = this.offsetY + pickup.y
        const playerX = this.offsetX + this.player.position.x
        const playerY = this.offsetY + this.player.position.y
        if (playerX > pickupX - 100 && playerX < pickupX + 100 && playerY > pickupY - 100 && playerY < pickupY + 100) {
          pickup.x += (playerX - pickupX) > 0 ? 5 : -5
          pickup.y += (playerY - pickupY) > 0 ? 5 : -5
        }

        if (playerX > pickupX - 16 && playerX < pickupX + 16 && playerY > pickupY - 16 && playerY < pickupY + 16) {
          this.game.pickups[pickupId].splice(this.game.pickups[pickupId].indexOf(pickup), 1)
          this.player.inventory.items.push(pickup)
        }
      })
    })
  }

  weaponHitDetection() {
    Object.keys(this.game.envObjects).forEach(envObjectsId => {
      this.game.envObjects[envObjectsId].forEach(envObject => {
        if (!this.player.equipped.weapons.primary.offsets) return
        const envObjectX = envObject.x
        const envObjectY = envObject.y
        const playerX = this.player.position.x
        const playerY = this.player.position.y
        if (playerX > envObjectX - 30 && playerX < envObjectX + 30 && playerY > envObjectY - 30 && playerY < envObjectY + 30) {
          // console.warn(envObject)
          const offsets = this.player.equipped.weapons.primary.offsets
          // console.warn(envObjectX, envObject  , this.player.equipped.weapons.primary.offsets)

          Object.keys(offsets).forEach(offsetType => {
            Object.keys(offsets[offsetType]).forEach(point => {
              const offsetPointX = this.centerX - offsets[offsetType][point].tx + this.player.position.x
              const offsetPointY = this.centerY - offsets[offsetType][point].ty + this.player.position.y
              if (
                offsetPointX > envObjectX 
                && offsetPointX < envObjectX + 16 
                && offsetPointY > envObjectY 
                && offsetPointY < envObjectY + 30
              ) {
                this.game.addPickup(new Pickup({ x: envObject.x, y: envObject.y }, generatePickupData))
                this.game.envObjects[envObjectsId] = this.game.envObjects[envObjectsId].filter(obj => obj.id !== envObject.id)
              }
            })
          })


        }

        // if (playerX > envObjectsX - 16 && playerX < envObjectsX + 16 && playerY > envObjectsY - 16 && playerY < envObjectsY + 16) {
        //   this.game.envObjects[envObjectsId].splice(this.game.envObjects[envObjectsId].indexOf(envObjects), 1)
        //   this.player.inventory.items.push(envObjects)
        // }
      })
    })
  }

  hitDetection() {
    this.pickupHitDetection()
    this.weaponHitDetection()
  //   this.playerHitDetection()
  //   this.peerHitDetection()
  }

  gameLoop() {
    this.update();
    // console.log(this.game.items)
    // Clear the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawBackground();
    this.drawLocation();
    this.drawEnvObjects();
    this.drawPickups();
    this.drawPlayer();
    this.drawPeers();
    this.drawWeapons();
    window.requestAnimationFrame(this.gameLoop.bind(this));
  }
}