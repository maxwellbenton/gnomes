import { defaultWeapons, defaultArmor } from '../constants/index.js';

export default class EquipmentHandler {
  constructor(player) {
    this.player = player
    this.weapons = defaultWeapons
    this.armor = defaultArmor
  }

  weightCheck(weight) {
    if (this.player.totalWeight + weight > this.player.stats.carryWeight) {
      throw new Error('You cannot carry that much weight!');
    }
  }

  equipWeapon(weapon) {
    this.weightCheck(weapon.weight);

    this.weapons.secondary = this.weapons.primary;
    this.weapons.primary = weapon;
    
  }

  unequipWeapon(type) {
    if (type) {
      if (this.weapons[type]) {
        this.player.inventory.items.push(this.weapons[type]);
        this.weapons[type] = null;

        
        return
      }

      throw new Error('You do not have that weapon equipped!');
    }

    throw new Error('You do not have any weapons equipped!');
  }

  equipArmor(armor) {
    const { armorType, weight } = armor;
    this.weightCheck(weight);

    if (this.armor[armorType]) {
      this.player.inventory.items.push(this.armor[armorType]);
    }

    this.armor[armorType] = armor;
    
  }

  unequipArmor(type) {
    if (this.armor[type]) {
      this.player.inventory.items.push(this.armor[type]);
      this.armor[type] = null;
      

      return
    }
      
    throw new Error('You do not have that armor equipped!');
  }

  get armorRating() {
    return this.armor.reduce((acc, armor) => acc + armor.rating, 0);
  }

  get weaponDamage() {
    return this.weapons.reduce((acc, weapon) => acc + weapon.damage, 0);
  }
}