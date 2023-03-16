import stuff from '../content/index.js';
import { enemies } from '../content/enemies.js';
import environmentObjects from '../content/environment-objects.js';
import { ARMOR, WEAPON, FOOD } from '../constants/index.js';

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

export function chooseRandomFood() {
  const foodIds = Object.keys(stuff.foods)
  const foodId = foodIds[Math.floor(Math.random() * foodIds.length)]
  return stuff.foods[foodId]
}

export function chooseRandomItem(itemType) {
  switch(itemType) {
    case ARMOR:
      return chooseRandomArmor()
    case WEAPON:
      return chooseRandomWeapon()
    case FOOD:
      return chooseRandomFood()
    default:
      console.error('Invalid item type!', itemType)
      return chooseRandomFood()
  }
}

export function chooseRandomEnemy() {
  const enemyIds = Object.keys(enemies)
  const enemyId = enemyIds[Math.floor(Math.random() * enemyIds.length)]
  return enemies[enemyId]
}

export function chooseRandomEnvObj() {
  const objectIds = Object.keys(environmentObjects)
  const objectId = objectIds[Math.floor(Math.random() * objectIds.length)]
  return environmentObjects[objectId]
}