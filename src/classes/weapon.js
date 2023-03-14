import { generateWeaponData } from '../helpers/generators.js';

class Weapon {
  constructor(initialWeaponData) {
    this.id = Math.floor(Math.random() * 1000000)

    const weaponData = generateWeaponData(initialWeaponData)

    Object.keys(weaponData).forEach(key => {
      console.log(key, weaponData[key])
      this[key] = weaponData[key]
    })

    if (!this.imageUrl) this.imageUrl = './src/assets/images/weapons/greatsword.png'
  }
}

export default Weapon;
