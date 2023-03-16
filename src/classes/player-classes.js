import Player from './player.js';
import stuff from '../content/index.js';
import Item from './pickup.js';
import Weapon from './weapon.js';
import Armor from './armor.js';
import { generateWeaponData, generateArmorData } from '../helpers/generators.js';

const sword = new Weapon(stuff.weapons.sword, generateWeaponData);
const staff = new Weapon(stuff.weapons.staff, generateWeaponData);
const dagger = new Weapon(stuff.weapons.dagger, generateWeaponData);
const mace = new Weapon(stuff.weapons.mace, generateWeaponData);
const bow = new Weapon(stuff.weapons.bow, generateWeaponData);
const shortsword = new Weapon(stuff.weapons.shortsword, generateWeaponData);
const longsword = new Weapon(stuff.weapons.longsword, generateWeaponData);

const ironArmor = new Armor(stuff.armor.ironArmor, generateArmorData);
const chainArmor = new Armor(stuff.armor.chainArmor, generateArmorData);
const leatherArmor = new Armor(stuff.armor.leatherArmor, generateArmorData);
const clothShirt = new Armor(stuff.armor.clothShirt, generateArmorData);

const ironPants = new Armor(stuff.armor.ironPants, generateArmorData);
const chainPants = new Armor(stuff.armor.chainPants, generateArmorData);
const leatherPants = new Armor(stuff.armor.leatherPants, generateArmorData);
const clothPants = new Armor(stuff.armor.clothPants, generateArmorData);

const leatherCloak = new Armor(stuff.armor.leatherCloak, generateArmorData);

// const oyster = new Item(stuff.foods.oyster);
// const shiitake = new Item(stuff.foods.shiitake);
// const acorn = new Item(stuff.foods.acorn);
// const chickenOfTheWoods = new Item(stuff.foods.chickenOfTheWoods);
// const chanterelle = new Item(stuff.foods.chanterelle);
// const morel = new Item(stuff.foods.morel);

// const rock = new Item(stuff.foods.rock);
// const stick = new Item(stuff.foods.stick);
// const branch = new Item(stuff.foods.branch);
// const log = new Item(stuff.foods.log);

export class FighterGnome extends Player {
  constructor() {
    super();
    this.className = 'Fighter';
    this.stats.strength += 2;
    this.stats.constitution += 1;
    this.equipped.equipArmor(ironArmor);
    this.equipped.equipArmor(leatherPants);
    this.equipped.equipWeapon(sword);
  }
}

export class WizardGnome extends Player {
  constructor() {
    super();
    this.className = 'Wizard';
    this.stats.intelligence += 2;
    this.stats.wisdom += 1;
    this.equipped.equipWeapon(staff);
    this.equipped.equipArmor(clothShirt);
    this.equipped.equipArmor(clothPants);
    this.equipped.equipArmor(leatherCloak);
  }
}

export class RogueGnome extends Player {
  constructor() {
    super();
    this.className = 'Rogue';
    this.stats.dexterity += 2;
    this.stats.charisma += 1;
    this.equipped.equipWeapon(shortsword);
    this.equipped.equipArmor(leatherArmor);
    this.equipped.equipArmor(clothPants);
  }
}

export class ClericGnome extends Player {
  constructor() {
    super();
    this.className = 'Cleric';
    this.stats.wisdom += 2;
    this.stats.charisma += 1;
    this.equipped.equipWeapon(mace);
    this.equipped.equipArmor(clothShirt);
    this.equipped.equipArmor(clothPants);
  }
}

export class PaladinGnome extends Player {
  constructor() {
    super();
    this.className = 'Paladin';
    this.stats.strength += 2;
    this.stats.charisma += 1;
    this.equipped.equipWeapon(longsword);
    this.equipped.equipArmor(chainArmor);
    this.equipped.equipArmor(chainPants);
  }
}

// export class RangerGnome extends Player {
//   constructor() {
//     super();
//      this.className = 'Ranger';
//     this.stats.dexterity += 2;
//     this.stats.wisdom += 1;
//     this.equipped.equipWeapon(bow);
//     this.equipped.equipArmor(leatherArmor);
//     this.equipped.equipArmor(leatherPants);
//   
//   
//   }
// }

export class DruidGnome extends Player {
  constructor() {
    super();
    this.className = 'Druid';
    this.stats.intelligence += 2;
    this.stats.constitution += 1;
    this.equipped.equipWeapon(staff);
    this.equipped.equipArmor(clothShirt);
    this.equipped.equipArmor(clothPants);
  }
}

export class MonkGnome extends Player {
  constructor() {
    super();
    this.className = 'Monk';
    this.stats.strength += 2;
    this.stats.dexterity += 1;
    this.equipped.equipWeapon(dagger);
    this.equipped.equipArmor(clothShirt);
    this.equipped.equipArmor(clothPants);
  }
}

export class BarbarianGnome extends Player {
  constructor() {
    super();
    this.className = 'Barbarian';
    this.stats.strength += 2;
    this.stats.constitution += 1;
    this.equipped.equipWeapon(sword);
    this.equipped.equipArmor(ironArmor);
    this.equipped.equipArmor(ironPants);
  }
}

export class SorcererGnome extends Player {
  constructor() {
    super();
    this.className = 'Sorcerer';
    this.stats.intelligence += 2;
    this.stats.charisma += 1;
    this.equipped.equipWeapon(staff);
    this.equipped.equipArmor(clothShirt);
    this.equipped.equipArmor(clothPants);
  }
}