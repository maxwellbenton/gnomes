import weapons from '../content/weapons.js'
import foods from '../content/foods.js'
import { enemies } from '../content/enemies.js'
import environmentObjects from '../content/environment-objects.js'
import { 
  playerWidth,
  playerHeight,
  weaponRotationRate 
} from '../constants/index.js'
import { safeDo } from '../helpers/index.js'
import { drawWeapon, scaleToWindow, turnWeapon } from '../helpers/canvas.js'
import { inPlayerArea, playerHitDetection } from '../helpers/collision.js'

function diceRoll() {
  return Math.floor(Math.random() * 6) + 1
}

function rollDice(numberOfDice, diceStore) {
  for (let i = 0; i < numberOfDice; i++) {
    diceStore[i] = diceRoll()
  }
}

try {
  if (!PIXI) console.warn('PIXI not found. Check internet connection.')
} catch (e) {
  console.warn('PIXI not found. Check internet connection.')
}

const {
  Application,
  TextureCache,
  Sprite,
  Container,
  Graphics,
  Text,
  TextStyle,
  Loader,
  resources,
  Rectangle,
  Texture,
  TilingSprite,
  BaseTexture,
  AnimatedSprite
} = PIXI

export default class PixiHandler {
  constructor(game, player, location, p2pHandler) {
    this.game = game
    this.player = player
    this.location = location
    this.app = new Application({
      // width: window.innerWidth, 
      // height: window.innerHeight,
      antialias: true,    // default: false
      // resizeTo: window
      // transparent: false, // default: false
      // resolution: 1       // default: 1
    });

    document.querySelector('#game').innerHTML = ""
    document.querySelector('#game').appendChild(this.app.view)

    this.state = this.loading
    this.app.renderer.view.style.position = "absolute";
    this.app.renderer.view.style.display = "block";
    // this.app.renderer.autoDensity = true;
    // this.app.resizeTo = window;
    this.app.resizeTo = window;
    
    scaleToWindow(this.app.renderer.view)

    this.width = this.app.renderer.view.width
    this.height = this.app.renderer.view.height

    // this.centerX = this.width / 2
    // this.centerY = this.height / 2
    // this.offsetX = 0
    // this.offsetY = 0

    this.loaded = false
    this.textures = {
      player: {}
    }

    this.sprites = {
      player: {
        legs: null,
        torso: null,
        head: null
      },
      weapon: {},
      enemies: {},
      envObject: {},
      food: {},
      pickups: {},
      background: {}
    }

    this.gameTexts = []

    this.player.position.viewAngle = 0
    this.player.position.rx = 0
    this.player.position.ry = 0
    this.player.position.rz = 0
    this.player.position.vx = 0
    this.player.position.vy = 0
    // console.warn(this.player.equipped)
    this.mouse = {
      x: 0,
      y: 0
    }
    this.firing = false
    this.keysPressed = {}
    this.keysUp = {}
    this.keysDown = {}

    this.p2pHandler = p2pHandler

    document.addEventListener('keydown', (event) => {
      this.keysPressed[event.key] = true;
    });
    
    const keysToRemember = ['1', '2', '3']
    document.addEventListener('keyup', (event) => {
      this.keysPressed[event.key] = false;
      if (keysToRemember.includes(event.key)) this.keysUp[event.key] = true;
    });

    this.previousState = null
//     this.state = this.loading
//     this.app.ticker.add((delta) => {
//       // if (this.player.currentHealthPercentage <= 0) this.state = this.gameOver
//       if (this.previousState !== this.state) {
//         console.log(`State changed from ${this.previousState?.name} to ${this.state.name}`)
//         this.setUpNextState(this.state.name)
//         this.previousState = this.state
//       }

//       this.state(delta)
//     })

    this.enemyIntervals = []
    this.previousLocation = null
    this.app.ticker.add(delta => {
      // if (this.loaded) this.state = this.start
      if (this.previousState !== this.state) {
        console.log(`State changed from ${this.previousState?.name} to ${this.state?.name}`)
        this.setUpNextState(this.state.name)
        this.previousState = this.state
      }

      if ((this.state === 'home' || this.state === 'playing') && this.previousLocation !== this.location) {
        this.updateLocation()
        this.previousLocation = this.location
      }
      
      this.gameLoop(delta)
    })
  }

  gameLoop(delta) {
    this.state(delta)
  }

  async loading() {
    const textures = await Promise.all([
      Texture.from('src/assets/images/backgrounds/debug-arena.png'),
      Texture.from('src/assets/images/backgrounds/home.png'),
      Texture.from('src/assets/images/backgrounds/home-dirt.png'),
      Texture.from('src/assets/images/backgrounds/forest.png'),
      Texture.from('src/assets/images/backgrounds/flatlands.png'),
      Texture.from('src/assets/images/backgrounds/field.png'),
      Texture.from('src/assets/images/backgrounds/dirt.png'),
      Texture.from('src/assets/images/backgrounds/beach.png'),
      Texture.from('src/assets/images/backgrounds/granite.png'),
      Texture.from('src/assets/images/characters/gnome-holding-down.png'),
      Texture.from('src/assets/images/characters/gnome-holding-right.png'),
      Texture.from('src/assets/images/characters/gnome-holding-up.png'),
      Texture.from('src/assets/images/characters/gnome-standing-1.png'),
      Texture.from('src/assets/images/characters/gnome-walking-1.png'),
      Texture.from('src/assets/images/characters/gnome-walking-2.png'),
    ])
    
    // this.currentBackground = null
    this.sprites.background = {
      debugArena: new Sprite(textures.find(texture => texture.baseTexture.resource.url.includes('debug-arena'))),
      backBackground: new TilingSprite(
        textures.find(texture => texture.baseTexture.resource.url.includes('home-dirt')),
        this.width,
        this.height
      ),
      home: new Sprite(textures.find(texture => texture.baseTexture.resource.url.includes('home-wood')))
    }

    this.textures.background = {
      forest: textures.find(texture => texture.baseTexture.resource.url.includes('forest')),
      flatlands: textures.find(texture => texture.baseTexture.resource.url.includes('flatlands')),
      field: textures.find(texture => texture.baseTexture.resource.url.includes('field')),
      dirt: textures.find(texture => texture.baseTexture.resource.url.includes('dirt')),
      beach: textures.find(texture => texture.baseTexture.resource.url.includes('beach')),
      granite: textures.find(texture => texture.baseTexture.resource.url.includes('granite')),
    }

    this.textures.player = {
      gnomeHoldingDown: textures.find(texture => texture.baseTexture.resource.url.includes('gnome-holding-down')),
      gnomeHoldingRight: textures.find(texture => texture.baseTexture.resource.url.includes('gnome-holding-right')),
      gnomeHoldingUp: textures.find(texture => texture.baseTexture.resource.url.includes('gnome-holding-up')),
      gnomeStanding1: textures.find(texture => texture.baseTexture.resource.url.includes('gnome-standing-1')),
      gnomeWalking1: textures.find(texture => texture.baseTexture.resource.url.includes('gnome-walking-1')),
      gnomeWalking2: textures.find(texture => texture.baseTexture.resource.url.includes('gnome-walking-2')),
    }

    this.sprites.player = new Sprite(this.textures.player.gnomeStanding1)

    this.sprites.background.backBackground.eventMode = 'dynamic'
    this.sprites.background.backBackground.on('pointermove', (event) => {
      this.mouse.xDiff = (this.width / 2) - event.global.x
      this.mouse.yDiff = (this.height / 2) - event.global.y
    })

    this.state = this.start
  }

  start(delta) {
    this.update(delta)
    this.updatePlayer()
  }

  home(delta) {
    this.update(delta)
    this.updatePlayer()
  }

  playing(delta) {
    this.update(delta)
    this.updatePlayer()
    this.updateWeapon()
  }

  gameOver() {
    // nothing to do here
  }

  setUpNextState(stateName) {
    // console.log(stateName, 'start', stateName === 'start')
    switch(stateName) {
      case 'loading':
        this.app.stage.removeChildren()

        this.bigText = new Text('Loading...', {
          fontFamily: 'Arial',
          fontSize: 36,
          fontStyle: 'italic',
          fontWeight: 'bold',
          fill: ['#ffffff', '#00ff99'], // gradient
          stroke: '#4a1850',
          strokeThickness: 5,
          dropShadow: true,
          dropShadowColor: '#000000',
          dropShadowBlur: 4,
          dropShadowAngle: Math.PI / 6,
          dropShadowDistance: 6,
          wordWrap: true,
          wordWrapWidth: 440,
          lineJoin: 'round',
        })
        this.bigText.x = (this.width / 2) - (this.bigText.width / 2)
        this.bigText.y = (this.height / 2) - (this.bigText.height / 2)
        this.app.stage.addChild(this.bigText)
        break
      case 'start': 
        this.player.position.rx = 0
        this.player.position.ry = 0
        this.app.stage.removeChildren()
        this.app.stage.addChild(this.sprites.background.backBackground)
        this.sprites.background.home.scale.x = 0.5
        this.sprites.background.home.scale.y = 0.5

        this.app.stage.addChild(this.sprites.background.home)

        this.bigText = new Text('Gnome Man\'s Land', {
          fontFamily: 'Luminari',
          fontSize: 56,
          fontStyle: 'italic',
          fontWeight: 'bold',
          fill: ['#aaddff', '#ffaa99'],
          stroke: '#4a1850',
          strokeThickness: 8,
          dropShadow: true,
          dropShadowColor: '#000000',
          dropShadowBlur: 4,
          dropShadowAngle: Math.PI / 6,
          dropShadowDistance: 6,
          wordWrap: true,
          wordWrapWidth: 200,
          lineJoin: 'round',
          align: 'center'
        })
        this.smallText = new Text('Press any key to start', {
          fontFamily: 'Arial',
          fontSize: 36,
          fontStyle: 'italic',
          fontWeight: 'bold',
          fill: ['#ffffff', '#00ff99'],
          stroke: '#4a1850',
          strokeThickness: 5,
          dropShadow: true,
          dropShadowColor: '#000000',
          dropShadowBlur: 4,
          dropShadowAngle: Math.PI / 6,
          dropShadowDistance: 6,
          wordWrap: true,
          wordWrapWidth: 440,
          lineJoin: 'round',
        })
        this.bigText.x = (this.width / 2) - (this.bigText.width / 2)
        this.bigText.y = (this.height / 2) - ((this.height / 2) / 1.1)
        this.app.stage.addChild(this.bigText)

        this.smallText.x = (this.width / 2) - (this.smallText.width / 2)
        this.smallText.y = (this.height / 2) + ((this.height / 2) / 2)
        this.app.stage.addChild(this.smallText)

        this.sprites.player.x = (this.width / 2)
        this.sprites.player.y = (this.height / 2)
        this.sprites.player.anchor.set(0.5)
        // this.offsetX = (this.width / 2) - this.player.position.rx
        // this.offsetY = (this.height / 2) - this.player.position.ry
        this.app.stage.addChild(this.sprites.player)

        

        // this.sprites.background.home.rx = -this.location.startingX
        // this.sprites.background.home.ry = -this.location.startingY
        // this.sprites.background.home.x = this.centerX + this.sprites.background.home.rx
        // this.sprites.background.home.y = this.centerY + this.sprites.background.home.ry
        break
      case 'home':
        this.bigText.visible = false
        this.smallText.visible = false
        break
      case 'playing':

        this.app.stage.removeChildren()
        this.app.stage.addChild(this.sprites.background.backBackground)
        this.sprites.background.backBackground.texture = this.textures.background.beach
        this.app.stage.addChild(this.sprites.background.debugArena)
        
        this.app.stage.addChild(this.sprites.player)

        this.player.position.rx = 0
        this.player.position.ry = 0
        this.sprites.player.x = this.width / 2
        this.sprites.player.y = this.height / 2
        this.sprites.player.anchor.set(0.5)
        // this.offsetX = this.centerX - this.player.position.rx
        // this.offsetY = this.centerY - this.player.position.ry
        // // this.sprites.background.debugArena.rx = -this.location.startingX
        // this.sprites.background.debugArena.ry = -this.location.startingY
        // this.sprites.background.home.x = this.centerX + this.sprites.background.home.rx
        // this.sprites.background.home.y = this.centerY + this.sprites.background.home.ry

        this.healthBar = new Container();
        this.healthBar.position.set(this.sprites.player.x - 8, this.sprites.player.y + 20);
        this.app.stage.addChild(this.healthBar);

        //Create the black background rectangle
        const innerBar = new Graphics();
        innerBar.beginFill(0x000000);
        innerBar.drawRect(0, 0, 16, 4);
        innerBar.endFill();
        this.healthBar.addChild(innerBar);

        //Create the front red rectangle
        const outerBar = new Graphics();
        outerBar.beginFill(0xFF3300);
        outerBar.drawRect(0, 0, 16, 4);
        outerBar.endFill();
        this.healthBar.addChild(outerBar);

        this.healthBar.outer = outerBar;

        this.smallText = new Text(`${this.player.position.rx}, ${this.player.position.ry}`, {
          fontFamily: 'Arial',
          fontSize: 10,
          fontStyle: 'italic',
          fontWeight: 'bold',
          fill: ['#ffffff', '#00ff99'],
          stroke: '#4a1850',
          strokeThickness: 5,
          dropShadow: true,
          dropShadowColor: '#000000',
          dropShadowBlur: 4,
          dropShadowAngle: Math.PI / 6,
          dropShadowDistance: 6,
          wordWrap: true,
          wordWrapWidth: 440,
          lineJoin: 'round',
        })

        this.smallText.x = this.sprites.player.x - 8, 
        this.smallText.y = this.sprites.player.y + 30
        this.app.stage.addChild(this.smallText)

        this.drawWeapon()
        this.enemyIntervals.push(setInterval(() => {
          // rollDice(this.numberOfDice, this.dice)
          this.spawnCheck()
    
        }, 1000))
        this.enemyIntervals.push(setInterval(() => {
          this.spawnBullet()
        }, 200))
        break
      case 'gameOver':
        console.warn('GAME OVER')
        this.enemyIntervals.forEach(interval => clearInterval(interval))
        this.app.stage.removeChildren()
        Object.keys(this.game.enemies).forEach((enemyType) => {
          Object.keys(this.game.enemies[enemyType]).forEach((enemyId) => {
            this.game.enemies[enemyType][enemyId].visible = false
          })
        })
        break
    }
  }

  updateLocation() {
    this.sprites.background.backBackground.texture = this.textures.background.beach
    this.sprites.background.backBackground.rx = -this.location.startingX
    this.sprites.background.backBackground.ry = -this.location.startingY
    this.sprites.background.backBackground.x = this.sprites.background.backBackground.rx
    this.sprites.background.backBackground.y = this.sprites.background.backBackground.ry
  }

  update(delta) {
    // rollDice(this.numberOfDice, this.dice)
    // console.warn(this.player.position.rx, delta)
    const currentAngle = this.player.position.viewAngle
    const actualAngle = Math.atan2(this.mouse.yDiff, this.mouse.xDiff) * 180 / Math.PI
    const change = this.player.stats.strength / this.player.equipped.weapons.primary.weight * weaponRotationRate
    
    turnWeapon(this.player, currentAngle, actualAngle, change)
    // console.warn(this.state.name, Object.keys(this.keysPressed).length)
    if (this.state.name === 'start' && Object.keys(this.keysPressed).length > 0) {
      console.log(this.state)
      this.state = this.home
      console.log(this.state)
    }
    let rxDiff = 0
    let ryDiff = 0

    if (this.keysPressed['w'] || this.keysPressed['ArrowUp']) {
      ryDiff += 1 * this.player.stats.speed
      // this.player.position.movementDirection.y = -1
    }
    if (this.keysPressed['s'] || this.keysPressed['ArrowDown']) {
      ryDiff -= 1 * this.player.stats.speed
      // this.player.position.movementDirection.y = 1
    }
    if (this.keysPressed['a'] || this.keysPressed['ArrowLeft']) {
      rxDiff -= 1 * this.player.stats.speed
      // this.player.position.movementDirection.x = -1
    }
    if (this.keysPressed['d'] || this.keysPressed['ArrowRight']) {
      rxDiff += 1 * this.player.stats.speed
      // this.player.position.movementDirection.x = 1
    }

    if (this.keysPressed[' ']) {
      // rxDiff += 1 * this.player.stats.speed
      // this.player.position.movementDirection.x = 1
      this.firing = true
    }

    this.player.position.rx += rxDiff
    this.player.position.ry += ryDiff


    
    if (this.keysUp['1']) {
      // this.player.equipped.weapons.primary = this.player.inventory.weapons.primary[0]
      console.log('SHOOT')
      delete this.keysUp['1']
    }

    if (this.keysUp['2']) {
      // this.player.equipped.weapons.primary = this.player.inventory.weapons.primary[0]
      console.log('SWING')
      delete this.keysUp['2']
    }

    if (this.keysUp['3']) {
      // this.player.equipped.weapons.primary = this.player.inventory.weapons.primary[0]
      console.log('UHH')
      delete this.keysUp['3']
    }

    
    const currentBackground = this.state.name === 'home' 
      ? this.sprites.background.home
      : this.state.name === 'playing'
        ? this.sprites.background.debugArena
        : this.sprites.background.debugArena

    this.sprites.background.backBackground.tilePosition = new PIXI.Point(-this.player.position.rx, this.player.position.ry)

    let outOfBounds = false
    if (this.player.position.rx - (playerWidth / 2) < -this.location.startingX && rxDiff < 0) {
      outOfBounds = true
    }
    if (this.player.position.ry - (playerHeight / 2) < -this.location.startingY && ryDiff < 0) {
      outOfBounds = true
    }
    if (this.player.position.rx + (playerWidth / 2) > this.location.width - this.location.startingX && rxDiff > 0) {
      outOfBounds = true
    }
    if (this.player.position.ry + (playerHeight / 2) > this.location.height - this.location.startingY && ryDiff > 0) {
      outOfBounds = true
    }

    if (outOfBounds) {
      if (this.location.name === 'home') {
        this.state = this.playing
      } 
    }

    currentBackground.x = currentBackground.rx
    currentBackground.y = currentBackground.ry
    
    this.smallText.text = `${this.player.position.rx}, ${this.player.position.ry}`

    this.gameTexts.forEach((text,id) => {
      text.x -= rxDiff
      text.y += ryDiff

      text.alpha -= 0.05
      if (text.alpha <= 0) {
        text.destroy()
        this.gameTexts.splice(id, 1)
      }
    })
    const hitboxPoints = this.player.equipped.weapons.primary.getHitboxPoints({ weapon: this.player.equipped.weapons.primary, target: this.player, center: {x: this.width / 2, y: this.height / 2} })
    const centerOffsets = hitboxPoints['centerOffsets']
    Object.keys(this.game.enemies).forEach((enemyType) => {
      Object.keys(this.game.enemies[enemyType]).forEach((enemyId) => {
        const enemy = this.game.enemies[enemyType][enemyId]
        
        let enemyXMove = 0
        let enemyYMove = 0

        if (enemy.x < (this.width / 2)) {
          enemyXMove += 1
        }

        if (enemy.x > (this.width / 2)) {
          enemyXMove -= 1
        }

        if (enemy.y < (this.height / 2)) {
          enemyYMove += 1
        }

        if (enemy.y > (this.height / 2)) {
          enemyYMove -= 1
        }

        enemy.rx -= rxDiff - enemyXMove
        enemy.ry += ryDiff + enemyYMove
        enemy.x -= rxDiff - enemyXMove
        enemy.y += ryDiff + enemyYMove

        if (inPlayerArea({ object: enemy, center: { x: this.width / 2, y: this.height / 2 } })) {
          if (playerHitDetection({ object: enemy, center: { x: this.width / 2, y: this.height / 2 } })) {
            this.player.currentHealthPercent -= 0.01
            if (this.player.currentHealthPercent <= 0) this.state = this.gameOver
            this.healthBar.outer.width = this.player.currentHealthPercent * this.healthBar.width
          }

          Object.keys(centerOffsets).forEach((offset) => {
            // console.warn(enemy, centerOffsets[offset].tx, centerOffsets[offset].ty)
            // debugger
            if (enemy.containsPoint({ x: centerOffsets[offset].x, y: centerOffsets[offset].y })) {
              enemy.healthPoints -= 1
              const hitText = new Text(`${1}`, {
                fontFamily: 'Arial',
                fontSize: 10,
                fontStyle: 'italic',
                fontWeight: 'bold',
                fill: ['#aaffaa'], // gradient
                stroke: '#000000',
                strokeThickness: 5,
                dropShadow: true,
                dropShadowColor: '#000000',
                dropShadowBlur: 1,
                wordWrap: true,
                wordWrapWidth: 440,
                lineJoin: 'round',
              })
              hitText.x = centerOffsets[offset].x
              hitText.y = centerOffsets[offset].y
              this.app.stage.addChild(hitText)
              this.gameTexts.push(hitText)
            }
          })
        }

        if (enemy.healthPoints <= 0) {
          enemy.destroy()
          delete this.game.enemies[enemyType][enemyId]
          this.game.enemyCount -= 1
          console.warn('enemy killed', this.game.enemyCount)
        }
      })
    })
  }

  spawnCheck() {
    if (this.game.enemyCount > 9) return
    // console.log('spawnCheck')
    // console.log({
    //   playerX: this.player.position.rx,
    //   playerY: this.player.position.ry,
    //   width: this.width,
    //   height: this.height,
    // })
    const xPos = Math.floor(Math.random() * this.width)
    const yPos = Math.floor(Math.random() * this.height)
    const rxDiff = xPos - (this.width / 2) + this.player.position.rx
    const ryDiff = yPos - (this.height / 2) + this.player.position.ry
    const enemyX = this.player.position.rx + rxDiff
    const enemyY = this.player.position.ry + ryDiff

  //   // chance per tick
  //   // const minRollForSpawn = this.numberOfDice * 4
    
  //   // if (this.diceTotal > minRollForSpawn) {
      const enemyType = 'square'
      const enemySprite = new Sprite(this.textures.player.gnomeStanding1)
      enemySprite.anchor.set(0.5)
      enemySprite.x = xPos
      enemySprite.y = yPos
      enemySprite.rx = enemyX
      enemySprite.ry = enemyY
      enemySprite.vx = 0
      enemySprite.vy = 0
      enemySprite.healthPoints = 10
      enemySprite.tint = 0x110000
      enemySprite.id = Math.random().toString(16).slice(2)
      enemySprite.width = 8
      enemySprite.height = 15
  //     console.warn('adding enemy')
      this.app.stage.addChild(enemySprite)
      if (!this.game.enemies[enemyType]) this.game.enemies[enemyType] = {}

      enemySprite.state = 'spawning'
      this.game.enemies[enemyType][enemySprite.id] = enemySprite
      this.game.enemyCount += 1
  }

  spawnBullet() {
    if (!this.firing) return
    
    const bullet = new Sprite(this.textures.player.gnomeStanding1)
    bullet.rx = this.player.position.rx
    bullet.ry = this.player.position.ry
    bullet.x = bullet.rx + (this.width / 2)
    bullet.y = bullet.ry + (this.height / 2)
    bullet.vx = Math.cos(this.player.position.viewAngle * (Math.PI / 180)) * 10
    bullet.vy = Math.sin(this.player.position.viewAngle * (Math.PI / 180)) * 10
    bullet.tint = 0x110000
    bullet.id = Math.random().toString(16).slice(2)
    bullet.width = 8
    bullet.height = 15
    console.warn('adding enemy')
    this.app.stage.addChild(bullet)
    if (!this.game.bullets) this.game.bullets = {}

    this.game.bullets[bullet.id] = bullet
  }

  updatePlayer() {
    const sprite = this.sprites.player
      // console.log(this.player.position.viewAngle)
      sprite.scale.x = 1
      switch (true) {
        case (this.player.position.viewAngle < -135):
          sprite.texture = this.textures.player.gnomeHoldingRight
          break
        case (this.player.position.viewAngle < -90):
          sprite.texture = this.textures.player.gnomeHoldingDown
          sprite.anchor.x = 0.5
          sprite.scale.x = -1
          break
        case (this.player.position.viewAngle < -45):
          sprite.texture = this.textures.player.gnomeHoldingDown
          break
        case (this.player.position.viewAngle < 45):
          sprite.texture = this.textures.player.gnomeHoldingRight
          sprite.anchor.x = 0.5
          sprite.scale.x = -1
          break
        case (this.player.position.viewAngle < 90):
          sprite.texture = this.textures.player.gnomeHoldingUp
          sprite.anchor.x = 0.5
          sprite.scale.x = -1
          break
        case (this.player.position.viewAngle < 135):
          sprite.texture = this.textures.player.gnomeHoldingUp
          
          break
        case (this.player.position.viewAngle <= 180):
          sprite.texture = this.textures.player.gnomeHoldingRight
          break
        default:
          sprite.texture = this.textures.player.gnomeStanding1
      }
  }

  drawWeapon() {
    this.weaponGraphic = new Graphics()
    this.weaponGraphic.beginFill(0xAADDFF);
    this.weaponGraphic.drawRect(
      -2, 
      4, 
      4,
      this.player.equipped.weapons.primary.length
    );
    this.weaponGraphic.x = this.sprites.player.x
    this.weaponGraphic.y = this.sprites.player.y + 8
    this.app.stage.addChild(this.weaponGraphic)
  }

  updateWeapon() {
    if (!this.player.equipped.weapons.primary) return

    const weapon = this.player.equipped.weapons.primary
    this.weaponGraphic.angle = this.player.position.viewAngle + 90
    // weapon.draw({ weapon, context, offsets: weapon.offsets })
    // if (this.weaponImage) {
    //   const rotatedWeapon = rotateAndCache(this.weaponImage, this.player.position.viewAngle * (Math.PI / 180))
    //   // context.drawImage(rotatedWeapon, this.centerX - this.weaponImage.height, this.centerY - this.weaponImage.height)
    // }
  }
}

    

//     // drawText(
//     //   this.ctx,
//     //   this.player.data.name,
//     //   (this.width / 2) - (playerWidth / 2),
//     //   (this.height / 2) - (playerHeight / 2) + 24,
//     //   10,
//     //   'white'
//     // )

//     // drawText(
//     //   this.ctx,
//     //   this.player.className,
//     //   (this.width / 2) - (playerWidth / 2),
//     //   (this.height / 2) - (playerHeight / 2) + 36,
//     //   10,
//     //   'white'
//     // )
//   }



//   addLoadingSprites() {
//     console.warn('adding loading sprites')
//     this.bigText = new Text('Loading...', {
//       fontFamily: 'Arial',
//       fontSize: 36,
//       fontStyle: 'italic',
//       fontWeight: 'bold',
//       fill: ['#ffffff', '#00ff99'], // gradient
//       stroke: '#4a1850',
//       strokeThickness: 5,
//       dropShadow: true,
//       dropShadowColor: '#000000',
//       dropShadowBlur: 4,
//       dropShadowAngle: Math.PI / 6,
//       dropShadowDistance: 6,
//       wordWrap: true,
//       wordWrapWidth: 440,
//       lineJoin: 'round',
//     })
//     this.bigText.x = this.centerX - (this.bigText.width / 2)
//     this.bigText.y = this.centerY - (this.bigText.height / 2)

//     this.app.stage.addChild(this.bigText)
//   }

//   removeLoadingSprites() {
//     this.app.stage.removeChild(this.bigText)
//   }

//   addStartScreenSprites() {
//     console.warn('adding startScreen sprites')
//     this.titleText = new Text('Gnome Man\'s Land', {
//       fontFamily: 'Arial',
//       fontSize: 36,
//       fontStyle: 'italic',
//       fontWeight: 'bold',
//       fill: ['#ffffff', '#00ff99'], // gradient
//       stroke: '#4a1850',
//       strokeThickness: 5,
//       dropShadow: true,
//       dropShadowColor: '#000000',
//       dropShadowBlur: 1,
//       dropShadowAngle: Math.PI / 3,
//       dropShadowDistance: 3,
//       wordWrap: true,
//       wordWrapWidth: 440,
//       lineJoin: 'round',
//     })

//     this.titleText.x = this.centerX - (this.titleText.width / 2)
//     this.titleText.y = this.centerY - (this.centerY / 2)

//     this.app.stage.addChild(this.titleText)
//   }

//   removeStartScreenSprites() {
//     this.app.stage.removeChild(this.titleText)
//   }

//   loading() {}
//   startScreen() {}
//   playing(delta) {
//     // this.removeStartScreenSprites()
//     this.update(delta)
//     // this.updatePlayer(delta)
//     this.updateWeapon(delta)
//     // this.drawWeapon()
//     // this.drawBackground()
//     // this.drawPlayer()
//     // this.drawWeapon()
//     // this.drawEnemies()
//     // this.drawHealthBar()
//     // this.drawDice()
//     // this.drawDiceTotal()
//     // this.drawPlayerStats()
//     // this.drawPlayerLevel()
//     // this.drawPlayerHealth()
//     // this.drawPlayerMana()
//     // this.drawPlayerExperience()
//     // this.drawPlayerGold()
//     // this.drawPlayerInventory()
//     // this.drawPlayerEquipment()
//     // this.drawPlayerAbilities()
//     // this.drawPlayerQuests()
//     // this.drawPlayerSkills()
//     // this.drawPlayerStatusEffects
//   }
//   gameOver() {

//   }
// }

    