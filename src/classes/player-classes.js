import Player from './player.js';
import stuff from '../content/index.js';
import Item from './pickup.js';
import Weapon from './weapon.js';
import Armor from './armor.js';

console.log('1', stuff.weapons)
const sword = new Weapon(stuff.weapons.sword);
const staff = new Weapon(stuff.weapons.staff);
const dagger = new Weapon(stuff.weapons.dagger);
const mace = new Weapon(stuff.weapons.mace);
const bow = new Weapon(stuff.weapons.bow);
const shortsword = new Weapon(stuff.weapons.shortsword);
const longsword = new Weapon(stuff.weapons.longsword);

const ironArmor = new Armor(stuff.armor.ironArmor);
const chainArmor = new Armor(stuff.armor.chainArmor);
const leatherArmor = new Armor(stuff.armor.leatherArmor);
const clothShirt = new Armor(stuff.armor.clothShirt);

const ironPants = new Armor(stuff.armor.ironPants);
const chainPants = new Armor(stuff.armor.chainPants);
const leatherPants = new Armor(stuff.armor.leatherPants);
const clothPants = new Armor(stuff.armor.clothPants);

const leatherCloak = new Armor(stuff.armor.leatherCloak);

const oyster = new Item(stuff.foods.oyster);
const shiitake = new Item(stuff.foods.shiitake);
const acorn = new Item(stuff.foods.acorn);
const chickenOfTheWoods = new Item(stuff.foods.chickenOfTheWoods);
const chanterelle = new Item(stuff.foods.chanterelle);
const morel = new Item(stuff.foods.morel);

const rock = new Item(stuff.foods.rock);
const stick = new Item(stuff.foods.stick);
const branch = new Item(stuff.foods.branch);
const log = new Item(stuff.foods.log);

export class FighterGnome extends Player {
  constructor() {
    super();
     this.className =  'Fighter';
    this.stats.strength += 2;
    this.stats.constitution += 1;
    this.equipped.equipArmor(ironArmor);
    this.equipped.equipArmor(leatherPants);
    this.equipped.equipWeapon(sword);
    this.inventory.add(new Item());
    this.inventory.add(new Item());
  }
}

export class WizardGnome extends Player {
  constructor() {
    super();
     this.className =  'Wizard';
    this.stats.intelligence += 2;
    this.stats.wisdom += 1;
    this.equipped.equipWeapon(staff);
    this.equipped.equipArmor(clothShirt);
    this.equipped.equipArmor(clothPants);
    this.equipped.equipArmor(leatherCloak);
    this.inventory.add(new Item());
    this.inventory.add(new Item());
  }
}

export class RogueGnome extends Player {
  constructor() {
    super();
     this.className =  'Rogue';
    this.stats.dexterity += 2;
    this.stats.charisma += 1;
    this.equipped.equipWeapon(shortsword);
    this.equipped.equipArmor(leatherArmor);
    this.equipped.equipArmor(clothPants);
    this.inventory.add(new Item());
    this.inventory.add(new Item());
  }
}

export class ClericGnome extends Player {
  constructor() {
    super();
     this.className =  'Cleric';
    this.stats.wisdom += 2;
    this.stats.charisma += 1;
    this.equipped.equipWeapon(mace);
    this.equipped.equipArmor(clothShirt);
    this.equipped.equipArmor(clothPants);
    this.inventory.add(new Item());
    this.inventory.add(new Item());
  }
}

export class PaladinGnome extends Player {
  constructor() {
    super();
     this.className =  'Paladin';
    this.stats.strength += 2;
    this.stats.charisma += 1;
    this.equipped.equipWeapon(longsword);
    this.equipped.equipArmor(chainArmor);
    this.equipped.equipArmor(chainPants);
    this.inventory.add(new Item());
    this.inventory.add(new Item());
  }
}

// export class RangerGnome extends Player {
//   constructor() {
//     super();
//      this.className =  'Ranger';
//     this.stats.dexterity += 2;
//     this.stats.wisdom += 1;
//     this.equipped.equipWeapon(bow);
//     this.equipped.equipArmor(leatherArmor);
//     this.equipped.equipArmor(leatherPants);
//     this.inventory.add(new Item());
//     this.inventory.add(new Item());
//   }
// }

export class DruidGnome extends Player {
  constructor() {
    super();
     this.className =  'Druid';
    this.stats.intelligence += 2;
    this.stats.constitution += 1;
    this.equipped.equipWeapon(staff);
    this.equipped.equipArmor(clothShirt);
    this.equipped.equipArmor(clothPants);
    this.inventory.add(new Item());
    this.inventory.add(new Item());
  }
}

export class MonkGnome extends Player {
  constructor() {
    super();
     this.className =  'Monk';
    this.stats.strength += 2;
    this.stats.dexterity += 1;
    this.equipped.equipWeapon(dagger);
    this.equipped.equipArmor(clothShirt);
    this.equipped.equipArmor(clothPants);
    this.inventory.add(new Item());
    this.inventory.add(new Item());
  }
}

export class BarbarianGnome extends Player {
  constructor() {
    super();
     this.className =  'Barbarian';
    this.stats.strength += 2;
    this.stats.constitution += 1;
    this.equipped.equipWeapon(sword);
    this.equipped.equipArmor(ironArmor);
    this.equipped.equipArmor(ironPants);
    this.inventory.add(new Item());
    this.inventory.add(new Item());
  }
}

export class SorcererGnome extends Player {
  constructor() {
    super();
     this.className =  'Sorcerer';
    this.stats.intelligence += 2;
    this.stats.charisma += 1;
    this.equipped.equipWeapon(staff);
    this.equipped.equipArmor(clothShirt);
    this.equipped.equipArmor(clothPants);
    this.inventory.add(new Item());
    this.inventory.add(new Item());
  }
}