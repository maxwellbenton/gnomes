import { generateHexColor, generateName } from '../helpers/generators.js'

const itemActions = {
  attack: 'attack',
  defend: 'defend',
  throw: 'throw',
  equip: 'equip',
  useItem: 'useItem',
  dropItem: 'dropItem',
}

const itemBaseDefaults = {
  maxWeight: 50,
  maxDamage: 2,
  maxHealthPoints: 100,
  maxArmorRating: 2,
  actions: [itemActions.attack, itemActions.defend, itemActions.throw, itemActions.equip, itemActions.useItem, itemActions.dropItem]
}

const armorItemDefaults = {
  actions: [itemActions.equip, itemActions.throw, itemActions.equip, itemActions.useItem, itemActions.dropItem],
  maxWeight: 200,
  maxDamage: 20,
  maxHealthPoints: 100,
  maxArmorRating: 70
}

const weaponItemDefaults = {
  ...itemBaseDefaults,
  maxWeight: 200,
  maxDamage: 20,
  maxHealthPoints: 100,
  maxArmorRating: 2,
}

export const ARMOR = 'armor'
export const WEAPON = 'weapon'
export const THING = 'thing'

// export const conditions = {
//   poor: 0.25,
//   fair: 0.25,
//   good: 0.25,
//   great: 0.25
// }

export const itemQualities = {
  common: {
    bar: 0,
    addedQuality: 0
  },
  uncommon: {
    bar: 0.50,
    addedQuality: 1
  },
  rare: {
    bar: 0.75,
    addedQuality: 2
  },
  epic: {
    bar: 0.90,
    addedQuality: 4
  },
  legendary: {
    bar: 0.98,
    addedQuality: 6
  },
}

export const itemDefaults = {
  item: itemBaseDefaults,
  armor: armorItemDefaults,
  weapon: weaponItemDefaults
}

export const defaultPlayerData = {
  name: 'Player ' + Math.floor(Math.random()*1000),
  color: generateHexColor(),
}

export const defaultPlayerPosition = {
  x: 0,
  y: 0,
  viewAngle: 0,
  movementDirection: {
    x: 0,
    y: 0
  }
}

export const defaultWeapons = {
  primary: null
}

export const defaultArmor = {
  head: null,
  chest: null,
  legs: null,
  feet: null,
  hands: null,
  neck: null,
  ring: null,
  belt: null,
  cloak: null,
  shield: null,
}