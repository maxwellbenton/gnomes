// import Player from './src/classes/player.js';
import { locations } from '../content/locations.js';
import { 
  generateEnvObjectData,
  generateLocationData
} from '../helpers/generators.js';
// import Pickup from './pickup.js';
import EnvObject from './env-object.js'
import Location from './location.js';
import P2PHandler from '../p2p/index.js'
// import SpatialHashMap from './spatial-hash-map.js'
import * as playerClasses from './player-classes.js'
import PixiHandler from './pixi-handler.js'

const classes = Object.values(playerClasses)

const PlayerClass = classes[Math.floor(Math.random() * classes.length)]

export default class Game {
  constructor() {
    this.player = new PlayerClass()
    this.p2pHandler = new P2PHandler(this.player)
    // this.graphics = new PIXI.Graphics();
    this.locations = {
      home: new Location(locations.home, generateLocationData),
      forest: new Location(locations.debugArena, generateLocationData)
    }
    this.location = this.locations.home

    this.pixiHandler = new PixiHandler(
      this, 
      this.player,
      this.location,
      this.p2pHandler
    )
    this.items = {}
    this.enemies = {}
    this.enemyCount = 0
    this.envObjects = {}
    this.envObjectCount = 0
    this.pickups = {}
    this.pickupCount = 0
    this.enemyCount = 0
    this.enemyMode = 'aggressive'
    this._state = null

    
    // this.canvasHandler = new CanvasHandler(this, this.player, this.location, this.p2pHandler, this.app)  

    // this.hashMap = new SpatialHashMap(
    //   this.canvasHandler.canvas.width / 5, 
    //   this.canvasHandler.canvas.height / 5
    // )

    // add mushies to cut
    while (this.envObjectCount < 1000) {
      const x = Math.floor(Math.random() * this.location.width)
      const y = Math.floor(Math.random() * this.location.height)
      this.addEnvObject(new EnvObject({ x, y }, generateEnvObjectData))
      this.envObjectCount += 1
    }
    
    // add mushies per second
    // setInterval(() => {
    //   if (this.pickupCount < 100) {
    //     const x = Math.floor(Math.random() * this.location.width)
    //     const y = Math.floor(Math.random() * this.location.height)
    //     this.addPickup(new Pickup({ x, y }))
    //   }
    // }, 2000)

    // add baddies per location spawn rate
    // setInterval(() => {
    //   if (
    //     this.enemyMode !== 'peaceful'
    //     && this.enemyCount < this.location.levels[this.location.level].enemyLimit
    //   ) {
    //     const x = Math.floor(Math.random() * this.location.width)
    //     const y = Math.floor(Math.random() * this.location.height)
    //     this.addEnemy(new Enemy({ x, y }))
    //   }
    // }, this.location.levels[this.location.level].spawnRate)

    // console.log(this.enemies)
    // console.log('location', this.location)
    // console.log(this.player.constructor.name.replace('Gnome', ''))
    // console.log('speed', this.player.stats.speed)
    // console.log('weapon', this.player.equipped.weapons.primary.name)
    // console.log('weapon length', this.player.equipped.weapons.primary.length)
    // console.log('weapon width', this.player.equipped.weapons.primary.width)
    // console.log('weapon color', this.player.equipped.weapons.primary.color)
    // console.log('weapon weight', this.player.equipped.weapons.primary.weight)
    // console.log('weapon damage', this.player.equipped.weapons.primary.damage)


    // console.log('armor', this.player.equipped.armor.name)
    // console.log('health', this.player.stats.health)
    // console.log('damage', this.player.stats.damage)
    // console.log('weight', this.player.stats.weight)
    


    // this.canvasHandler.gameLoop()
  }

  get state() {
    return this._state
  }

  set state(state) {
    this._state = state
  }

  addItem(item) {
    if (!this.items[item.name]) {
      this.items[item.name] = []
    }
    this.items[item.name].push(item)
  }

  removeItem(item) {
    if (!this.items[item.name]) {
      return
    }

    this.items[item.name] = this.items[item.name].filter(i => i.id !== item.id)
  }

  addEnemy(enemy) {
    if (!this.enemies[enemy.name]) {
      this.enemies[enemy.name] = []
    }
    this.enemies[enemy.name].push(enemy)
    this.enemyCount += 1
  }

  removeEnemy(enemy) {
    if (!this.enemies[enemy.name]) {
      return
    }

    this.enemies[enemy.name] = this.enemies[enemy.name].filter(i => i.id !== enemy.id)

    this.enemyCount -= 1
  }

  addPickup(pickup) {
    if (!this.pickups[pickup.name]) {
      this.pickups[pickup.name] = []
    }
    this.pickups[pickup.name].push(pickup)
    this.pickupCount += 1
  }

  removePickup(pickup) {
    if (!this.pickups[pickup.name]) {
      return
    }

    this.pickups[pickup.name] = this.pickups[pickup.name].filter(i => i.id !== pickup.id)
    this.pickupCount -= 1
  }

  addEnvObject(envObject) {
    if (!this.envObjects[envObject.name]) {
      this.envObjects[envObject.name] = []
    }
    this.envObjects[envObject.name].push(envObject)
    this.envObjectCount += 1
    return envObject
  }

  removeEnvObject(envObject) {
    if (!this.envObjects[envObject.name]) {
      return
    }

    this.envObjects[envObject.name] = this.envObjects[envObject.name].filter(i => i.id !== envObject.id)
    this.envObjectCount -= 1
  }
}