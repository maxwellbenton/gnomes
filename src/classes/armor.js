import { generateArmorData } from '../helpers/generators.js';

class Armor {
  constructor(initialArmorData) {
    const {
      type,
      armorType,
      name,
      description,
      condition,
      quality,
      weight,
      armorRating
    } = generateArmorData(initialArmorData)

    this.id = Math.floor(Math.random() * 1000000)
    this.type = type;
    this.name = name;
    this.description = description;
    this.condition = condition;
    this.quality = quality;
    this.weight = weight;
    this.armorType = armorType;
    this.armorRating = armorRating;
    this.condition = condition;
  }
}

export default Armor;
