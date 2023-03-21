import { defaultPlayerData, defaultPlayerPosition } from '../constants/index.js';
import { generateStats, generateName } from '../helpers/generators.js';
import { InventoryHandler } from './inventory-handler.js';
import EquipmentHandler from './equipment-handler.js';

export default class Player {
  constructor() {
    this.id = new Array(7).fill(0).map(() => Math.random().toString(36).substring(2, 8)).join('-')
    this.className = null
    this.inventory = new InventoryHandler(this)
    this.equipped = new EquipmentHandler(this)
    this.data = defaultPlayerData
    this.stats = generateStats()
    this.currentHealthPercent = 1
    this.position = defaultPlayerPosition
    this.location = 'home'
    this.friends = {}
    this.acquaintances = {}
    this.p2pHandler = null
    this.imageUrl = './src/assets/images/characters/character.png'
    this.data.name = generateName()
  }

  get totalWeight() {
    const inventoryWieght = this.inventory.items.reduce((acc, item) => acc + item.weight, 0);
    const equppedWeaponWeight = Object.keys(this.equipped.weapons).reduce((acc, weaponType) => {
      if (!this.equipped.weapons[weaponType]) return acc
      return acc + this.equipped.weapons[weaponType].weight
    }, 0);
    const equppedArmorWeight = Object.keys(this.equipped.armor).reduce((acc, armorType) => {
      if (!this.equipped.armor[armorType]) return acc
      return acc + this.equipped.armor[armorType].weight
    }, 0);

    return inventoryWieght + equppedWeaponWeight + equppedArmorWeight;
  }

  updatePosition(position) {
    this._position = {
      ...this._position,
      ...position
    }
  }

  addAcquaintance(peer) {
    this.acquaintances[peer.id] = peer
  }
}