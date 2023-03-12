import { getRandomIntBetween, chooseRandomItem, chooseRandomEnemy } from './index.js';
import { ARMOR, WEAPON, THING } from '../constants/index.js';
import { locations } from '../content/locations.js';
import { names } from '../content/names.js';

export function generateWeaponData(initialWeaponData = chooseRandomItem(WEAPON)) {
  const { 
    type,
    name,
    description,
    minDamage,
    maxDamage,
    minWeight,
    maxWeight,
    minSpeed,
    maxSpeed,
    length,
    color,
    width,
    draw
  } = initialWeaponData
  
  return {
    type,
    name,
    description,
    damage: getRandomIntBetween(minDamage, maxDamage),
    speed: getRandomIntBetween(minSpeed, maxSpeed),
    weight: getRandomIntBetween(minWeight, maxWeight),
    condition: 'new',
    length,
    color,
    width,
    draw
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

export function generateItemData(initialItemData = chooseRandomItem(THING)) {
  const {
    type,
    name,
    description,
    minHealthPoints,
    maxHealthPoints
  } = initialItemData

  return {
    type,
    name,
    description,
    healthPoints: getRandomIntBetween(minHealthPoints, maxHealthPoints)
  }
}

export function generateEnemyData(initialEnemyData) {
  if (!initialEnemyData.name) {
    initialEnemyData = {
      ...initialEnemyData,
      ...chooseRandomEnemy()
    }
  }
  console.log('1', initialEnemyData)

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