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
import { playerHitDetection } from '../helpers/collision.js'

function diceRoll() {
  return Math.floor(Math.random() * 6) + 1
}

function rollDice(numberOfDice, diceStore) {
  for (let i = 0; i < numberOfDice; i++) {
    diceStore[i] = diceRoll()
  }
}

if (!PIXI) console.warn('PIXI not found. Check internet connection.')

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

    this.centerX = this.width / 2
    this.centerY = this.height / 2
    this.offsetX = 0
    this.offsetY = 0

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

    this.player.position.viewAngle = 0
    this.player.position.rx = 0
    this.player.position.ry = 0
    this.player.position.rz = 0
    this.player.position.vx = 0
    this.player.position.vy = 0
    this.mouse = {
      x: 0,
      y: 0
    }

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

    this.app.ticker.add(delta => {
      // if (this.loaded) this.state = this.start
      if (this.previousState !== this.state) {
        console.log(`State changed from ${this.previousState?.name} to ${this.state?.name}`)
        this.setUpNextState(this.state.name)
        this.previousState = this.state
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
      this.mouse.xDiff = (this.centerX) - event.global.x
      this.mouse.yDiff = (this.centerY) - event.global.y
    })

    this.state = this.start
  }

  start(delta) {
    // nothing to do here
    this.update(delta)
    this.updatePlayer()
  }

  home(delta) {
    // nothing to do here
    this.update(delta)
    this.updatePlayer()
  }

  playing(delta) {
    // nothing to do here
    this.update(delta)
    this.updatePlayer()
    this.updateWeapon()
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
        this.bigText.x = this.centerX - (this.bigText.width / 2)
        this.bigText.y = this.centerY - (this.bigText.height / 2)
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
        this.bigText.x = this.centerX - (this.bigText.width / 2)
        this.bigText.y = this.centerY - (this.centerY / 1.1)
        this.app.stage.addChild(this.bigText)

        this.smallText.x = this.centerX - (this.smallText.width / 2)
        this.smallText.y = this.centerY + (this.centerY / 2)
        this.app.stage.addChild(this.smallText)

        this.sprites.player.x = this.centerX
        this.sprites.player.y = this.centerY
        this.sprites.player.anchor.set(0.5)
        this.offsetX = this.centerX - this.player.position.rx
        this.offsetY = this.centerY - this.player.position.ry
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

        this.player.position.rx = 0
        this.player.position.ry = 0
        this.app.stage.removeChildren()
        this.app.stage.addChild(this.sprites.background.backBackground)
        this.sprites.background.backBackground.texture = this.textures.background.forest
        this.app.stage.addChild(this.sprites.background.debugArena)
        
        this.app.stage.addChild(this.sprites.player)

        this.sprites.player.x = this.centerX
        this.sprites.player.y = this.centerY
        this.sprites.player.anchor.set(0.5)
        this.offsetX = this.centerX - this.player.position.rx
        this.offsetY = this.centerY - this.player.position.ry
        // this.sprites.background.debugArena.rx = -this.location.startingX
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

        this.drawWeapon()
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

  update(delta) {
    rollDice(this.numberOfDice, this.dice)

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
      rxDiff += 1 * this.player.stats.speed
      // this.player.position.movementDirection.x = -1
    }
    if (this.keysPressed['d'] || this.keysPressed['ArrowRight']) {
      rxDiff -= 1 * this.player.stats.speed
      // this.player.position.movementDirection.x = 1
    }

    this.player.position.rx += rxDiff
    this.player.position.ry += ryDiff


    
    if (this.keysUp['1']) {
      // this.player.equipped.weapons.primary = this.player.inventory.weapons.primary[0]
      console.log('BUILD')
      delete this.keysUp['1']
    }

    if (this.keysUp['2']) {
      // this.player.equipped.weapons.primary = this.player.inventory.weapons.primary[0]
      console.log('FIGHT')
      delete this.keysUp['2']
    }

    if (this.keysUp['3']) {
      // this.player.equipped.weapons.primary = this.player.inventory.weapons.primary[0]
      console.log('UHH')
      delete this.keysUp['3']
    }

    
    // this.player.position.rx += delta
    // this.player.position.ry += delta

    // location bounds
    
    // window bounds
    // this.leftBound = this.player.position.rx - this.centerX
    // this.rightBound = this.player.position.rx + this.centerX
    // this.topBound = this.player.position.ry - this.centerY
    // this.bottomBound = this.player.position.ry + this.centerY

    this.offsetX = this.centerX - this.player.position.rx
    this.offsetY = this.centerY - this.player.position.ry

    const currentBackground = this.state.name === 'home' 
      ? this.sprites.background.home
      : this.state.name === 'playing'
        ? this.sprites.background.debugArena
        : this.sprites.background.debugArena

    // updates background position
    // this.sprites.background.backBackground.tilePosition += rxDiff
    // currentBackground.ry += ryDiff
    // console.warn(this.sprites.background.backBackground)
    this.sprites.background.backBackground.tilePosition = new PIXI.Point(this.player.position.rx, this.player.position.ry)

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
        this.location = this.game.locations.forest
        this.state = this.playing
      } else {
        
      }
    }

    currentBackground.x = this.centerX + currentBackground.rx
    currentBackground.y = this.centerY + currentBackground.ry
    

    // this.backgroundSprite.x = this.leftBound
    // this.backgroundSprite.y = this.topBound
    
    // Object.keys(this.game.enemies).forEach((enemyType) => {
    //   Object.keys(this.game.enemies[enemyType]).forEach((enemyId) => {
    //     const enemy = this.game.enemies[enemyType][enemyId]

    //     // if (enemy.x < this.leftBound || enemy.x > this.rightBound || enemy.y < this.topBound || enemy.y > this.bottomBound) {
    //     //   enemy.visible = false
    //     // }
    //     // if (inPlayerArea()) {

    //     // }

    //     if (playerHitDetection({ object: enemy, player: this.player, center: { x: this.centerX, y: this.centerY } })) {
    //       this.player.currentHealthPercent -= 0.1
    //       console.warn(this.player.currentHealthPercent)
    //       if (this.player.currentHealthPercent <= 0) this.state = this.gameOver
    //       this.healthBar.outer.width = this.player.currentHealthPercent * this.healthBar.width
    //     }
    //     // if (enemy.x - this.centerX > this.player.position.rx || enemy.x + this.centerX < this.player.position.rx || enemy.y - this.centerY > this.player.position.ry || enemy.y + this.centerY < this.player.position.ry) {
    //     // enemies[enemyType].updateBehavior(enemy, this.player)
    //     enemies[enemyType].states[enemy.state].act({
    //       sprite: enemy, 
    //       dice: this.dice, 
    //       player: this.player, 
    //       center: { x: this.centerX, y: this.centerY },
    //     })
    //     enemy.x += enemy.vx
    //     enemy.y += enemy.vy
    //   })
    // })
  }

  spawnCheck() {
    if (this.game.enemyCount > 9) return

    // chance per tick
    const minRollForSpawn = this.numberOfDice * 4

    if (this.diceTotal > minRollForSpawn) {
      const enemyType = 'square'
      const enemySprite = new Sprite(this.playerTextures['gnome-standing-1'])
      enemySprite.x = (Math.random() * this.location.width) - this.offsetX
      enemySprite.y = (Math.random() * this.location.height) - this.offsetY
      enemySprite.vx = 0
      enemySprite.vy = 0
      enemySprite.tint = 0x110000
      enemySprite.id = Math.random().toString(16).slice(2)
      enemySprite.width = 8
      enemySprite.height = 15
      console.warn('adding enemy')
      this.app.stage.addChild(enemySprite)
      if (!this.game.enemies[enemyType]) this.game.enemies[enemyType] = {}

      enemySprite.state = 'spawning'
      this.game.enemies[enemyType][enemySprite.id] = enemySprite
      this.game.enemyCount += 1
    }

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
      50
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
// export default class PixiHandler {
//   constructor(game, player, location, p2pHandler) {
//     this.game = game
//     this.player = player
//     this.location = location
//     this.p2pHandler = p2pHandler
//     this.app = new Application({ 
//       width: window.innerWidth, 
//       height: window.innerHeight,
//       antialias: true,    // default: false
//       // transparent: false, // default: false
//       // resolution: 1       // default: 1
//     });

//     document.querySelector('#game').innerHTML = ""
//     document.querySelector('#game').appendChild(this.app.view)

//     this.state = this.loading
//     this.app.resizeTo = window;
//     scaleToWindow(this.app.renderer.view)
//     this.app.renderer.events.features.globalMove = true

//     this.width = this.app.stage.width
//     this.height = this.app.stage.height
    
//     this.centerX = this.width / 2
//     this.centerY = this.height / 2

//     this.playerImages = {}
    
//     this.player.position.viewAngle = 0

//     this.keysPressed = {}
//     this.keysUp = {}
//     this.mouse = {
//       x: 0,
//       y: 0,
//       xDiff: 0,
//       yDiff: 0,
//     }
//     this.dice = {}
//     this.numberOfDice = 4
//     rollDice(this.numberOfDice, this.dice)
    
//     document.addEventListener('keydown', (event) => {
//       if (this.state.name === 'startScreen') this.state = this.playing

//       this.keysPressed[event.key] = true;
//     });
    
//     const keysToRemember = ['1', '2', '3']
//     document.addEventListener('keyup', (event) => {
//       this.keysPressed[event.key] = false;
//       if (keysToRemember.includes(event.key)) this.keysUp[event.key] = true;
//     });

//     this.backgroundTexture = null
//     this.playerImage = null
//     this.weaponImage = null
//     this.images = {}
//     this.imagesLoaded = false

//     this.getImages()
//       .then(() => this.setup())
    
//     this.backgroundColor = 'black'

//     this.enemyIntervals = []
    

//     this.previousState = null
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
//   }

//   get diceTotal() {
//     return Object.values(this.dice).reduce((a, b) => a + b, 0)
//   }

//   get diceMax() {
//     return this.numberOfDice * 6
//   }

//   get diceMin() {
//     return this.numberOfDice
//   }

//   setUpNextState(stateName) {
//     switch(stateName) {
//       case 'loading':
//         this.addLoadingSprites()
//         break
//       case 'startScreen':

//         this.removeLoadingSprites()
//         this.addStartScreenSprites()
//         // this.app.stage.removeChild(this.backgroundSprite)
        
//         break
//       case 'playing':
//         console.warn('adding main game sprites')
//         // this.enemyIntervals.push(setInterval(() => {
//         //   rollDice(this.numberOfDice, this.dice)
//         //   this.spawnCheck()
    
//         // }, 1000))

//         this.titleText.visible = false
//         this.drawWeapon()
        

//         this.healthBar = new Container();
//         this.healthBar.position.set(this.app.stage.width - 170, 4);
//         this.app.stage.addChild(this.healthBar);

//         //Create the black background rectangle
//         const innerBar = new Graphics();
//         innerBar.beginFill(0x000000);
//         innerBar.drawRect(0, 0, 128, 8);
//         innerBar.endFill();
//         this.healthBar.addChild(innerBar);

//         //Create the front red rectangle
//         const outerBar = new Graphics();
//         outerBar.beginFill(0xFF3300);
//         outerBar.drawRect(0, 0, 128, 8);
//         outerBar.endFill();
//         this.healthBar.addChild(outerBar);

//         this.healthBar.outer = outerBar;
//         break
//       case 'gameOver':
//         console.warn('GAME OVER')
//         this.enemyIntervals.forEach(interval => clearInterval(interval))
//         this.backgroundSprite.visible = false
//         this.playerSprite.visible = false
//         this.healthBar.visible = false
//         this.titleText.text = 'Game Over'
//         this.titleText.visible = true
//         this.titleText.x = this.centerX - this.titleText.width / 2
//         Object.keys(this.game.enemies).forEach((enemyType) => {
//           Object.keys(this.game.enemies[enemyType]).forEach((enemyId) => {
//             this.game.enemies[enemyType][enemyId].visible = false
//           })
//         })
//         break
//     }
//   }








    

    

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

    