import { generateItemData } from '../helpers/generators.js';

class Pickup {
  constructor(initialItemData) {
    const {
      type,
      name,
      description,
      weight,
      healthPoints
    } = generateItemData(initialItemData)
    this.id = Math.floor(Math.random() * 1000000)
    this.type = type;
    this.name = name;
    this.description = description;
    this.weight = weight;
    this.healthPoints = healthPoints;
  }
}

export default Pickup;
