// import Player from './src/classes/player.js';
import { locations } from '../content/locations.js';
import Pickup from './pickup.js';
import Location from './location.js';
import P2PHandler from '../p2p/index.js'
import * as playerClasses from './player-classes.js'
import CanvasHandler from './canvasHandler.js'

const classes = Object.values(playerClasses)

const PlayerClass = classes[Math.floor(Math.random() * classes.length)]

export default class Game {
  constructor() {
    this.player = new PlayerClass()
    this.p2pHandler = new P2PHandler(this.player)
    
    this.items = {}
    this.enemies = {}
    this.pickups = {}
    this.pickupCount = 0
    this.enemyCount = 0
    this.enemyMode = 'aggressive'

    this.location = new Location(locations.debugArena, this.player)
    
    this.canvasHandler = new CanvasHandler(this, this.player, this.location, this.p2pHandler)  

    setInterval(() => {
      if (this.pickupCount < 100) {
        const x = Math.floor(Math.random() * this.location.width)
        const y = Math.floor(Math.random() * this.location.height)
        this.addPickup(new Pickup({ x, y }))
      }
    }, 2000)

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

    console.log(this.enemies)
    console.log('location', this.location)
    console.log(this.player.constructor.name.replace('Gnome', ''))
    console.log('speed', this.player.stats.speed)
    console.log('weapon', this.player.equipped.weapons.primary.name)
    console.log('weapon length', this.player.equipped.weapons.primary.length)
    console.log('weapon width', this.player.equipped.weapons.primary.width)
    console.log('weapon color', this.player.equipped.weapons.primary.color)
    console.log('weapon weight', this.player.equipped.weapons.primary.weight)
    console.log('weapon damage', this.player.equipped.weapons.primary.damage)


    // console.log('armor', this.player.equipped.armor.name)
    console.log('health', this.player.stats.health)
    // console.log('damage', this.player.stats.damage)
    // console.log('weight', this.player.stats.weight)
    


    this.canvasHandler.gameLoop()
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
}