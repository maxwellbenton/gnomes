import { 
  chooseRandomEnemy,
  chooseRandomEnvObj, 
  chooseRandomItem, 
  getRandomIntBetween
} from './index.js';
import { ARMOR, WEAPON, FOOD } from '../constants/index.js';
import { names } from '../content/names.js';

export function generateWeaponData(initialWeaponData = chooseRandomItem(WEAPON)) {
  const { 
    minDamage,
    maxDamage,
    minWeight,
    maxWeight,
    minSpeed,
    maxSpeed,
  } = initialWeaponData
  
  return {
    damage: getRandomIntBetween(minDamage, maxDamage),
    speed: getRandomIntBetween(minSpeed, maxSpeed),
    weight: getRandomIntBetween(minWeight, maxWeight),
    condition: 'new',
    ...initialWeaponData
  }
}

export function generateArmorData(initialArmorData = chooseRandomItem(ARMOR)) {
  const {
    type,
    armorType,
    name,
    description,
    minArmorRating,
    maxArmorRating,
    minWeight,
    maxWeight,
  } = initialArmorData
  
  return {
    type,
    armorType,
    name,
    description,
    armorRating: getRandomIntBetween(minArmorRating, maxArmorRating),
    weight: getRandomIntBetween(minWeight, maxWeight),
    condition: 'new',   
  }
}

export function generatePickupData(initialItemData) {
  const pickup = { ...chooseRandomItem(FOOD), ...initialItemData }
  const {
    minHealthPoints,
    maxHealthPoints,
    ...pickupProperties
  } = pickup

  return {
    healthPoints: getRandomIntBetween(minHealthPoints, maxHealthPoints),
    ...pickupProperties
  }
}

export function generateEnvObjectData(initialEnvObjData) {
  const envObj = { ...chooseRandomEnvObj(FOOD), ...initialEnvObjData }
  const {
    minHealthPoints,
    maxHealthPoints,
    ...envObjProperties
  } = envObj

  return {
    healthPoints: getRandomIntBetween(minHealthPoints, maxHealthPoints),
    ...envObjProperties
  }
}

export function generateEnemyData(initialEnemyData) {
  if (!initialEnemyData.name) {
    initialEnemyData = {
      ...initialEnemyData,
      ...chooseRandomEnemy()
    }
  }

  return {
    ...initialEnemyData
  }
}

export function generateLocationData(initialLocationData) {
  return {
    ...initialLocationData
  }
}

export function generateHexColor() {
  return '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
}

export function generateName() {
  const { firstNames, lastNames } = names.en.gnome
  return `${firstNames[getRandomIntBetween(0, firstNames.length - 1)]} ${lastNames[getRandomIntBetween(0, lastNames.length - 1)]}`
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