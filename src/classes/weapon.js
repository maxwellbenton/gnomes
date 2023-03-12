import { generateWeaponData } from '../helpers/generators.js';

class Weapon {
  constructor(initialWeaponData) {
    const {
      type,
      name,
      description,
      condition,
      quality,
      weight,
      damage,
      length,
      width,
      color,
      draw
    } = generateWeaponData(initialWeaponData)
    // console.log('initialWeaponData', initialWeaponData)
    // console.log('generateItemData(initialItemData)', {
    //   type,
    //   name,
    //   description,
    //   condition,
    //   quality,
    //   weight,
    //   damage,
    //   length,
    //   width,
    //   color,
    //   draw
    // })
    
    this.id = Math.floor(Math.random() * 1000000)
    this.type = type;
    this.name = name;
    this.description = description;
    this.condition = condition;
    this.quality = quality;
    this.weight = weight;

    this.damage = damage;
    this.length = length;
    this.width = width;
    this.color = color;
    this.draw = draw;
  }
}

export default Weapon;
