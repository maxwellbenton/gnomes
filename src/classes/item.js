import { generateItemData } from '../helpers/generators.js';

class Item {
  constructor(initialItemData) {
    const {
      type,
      armorType,
      name,
      description,
      condition,
      quality,
      weight,
      damage,
      speed,
      length,
      armorRating,
      healthPoints,
      rx,
      ry
    } = generateItemData(initialItemData)
    this.id = Math.floor(Math.random() * 1000000)
    this.type = type;
    this.name = name;
    this.description = description;
    this.condition = condition;
    this.quality = quality;
    this.weight = weight;
    this.position = {
      rx,
      ry
    }

    if (armorType) this.armorType = armorType;
    if (damage) this.damage = damage;
    if (speed) this.speed = speed;
    if (length) this.length = length;
    if (armorRating) this.armorRating = armorRating;
    if (healthPoints) this.healthPoints = healthPoints;
    if (condition) this.condition = condition;
  }
}

export default Item;
