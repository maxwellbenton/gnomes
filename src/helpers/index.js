import stuff from '../content/index.js';
import { enemies } from '../content/enemies.js';
import { ARMOR, WEAPON, THING } from '../constants/index.js';

export function checkParamsFor(param) {
  let params = new URLSearchParams(window.location.search);
  return params.get(param)
}

export function getRandomIntBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function generateStats() {
  const strength = getRandomIntBetween(1,10)
  const dexterity = getRandomIntBetween(1,10)
  const constitution = getRandomIntBetween(1,10)
  const intelligence = getRandomIntBetween(1,10)
  const wisdom = getRandomIntBetween(1,10)
  const charisma = getRandomIntBetween(1,10)
  
  const health = (constitution * 10) + (strength * 5)
  const mana = (intelligence * 10) + (wisdom * 5)
  const stamina = (dexterity * 10) + (strength * 5)
  const carryWeight = (strength * 10) + (dexterity * 5)
  const speed = ((dexterity * 10) + (strength * 5)) / 25

  return {
    strength,
    dexterity,
    constitution,
    intelligence,
    wisdom,
    charisma,
    health,
    mana,
    stamina,
    carryWeight,
    speed
  }
}

export function chooseRandomArmor() {
  const armorIds = Object.keys(stuff.armor)
  const armorId = armorIds[Math.floor(Math.random() * armorIds.length)]
  return stuff.armor[armorId]
}

export function chooseRandomWeapon() {
  const weaponIds = Object.keys(stuff.weapons)
  const weaponId = weaponIds[Math.floor(Math.random() * weaponIds.length)]
  return stuff.weapons[weaponId]
}

export function chooseRandomThing() {
  const thingIds = Object.keys(stuff.things)
  const thingId = thingIds[Math.floor(Math.random() * thingIds.length)]
  return stuff.things[thingId]
}

export function chooseRandomItem(itemType) {
  switch(itemType) {
    case ARMOR:
      return chooseRandomArmor()
    case WEAPON:
      return chooseRandomWeapon()
    case THING:
      return chooseRandomThing()
    default:
      console.error('Invalid item type!', itemType)
      return chooseRandomThing()
  }
}

export function chooseRandomEnemy() {
  const enemyIds = Object.keys(enemies)
  const enemyId = enemyIds[Math.floor(Math.random() * enemyIds.length)]
  return enemies[enemyId]
}