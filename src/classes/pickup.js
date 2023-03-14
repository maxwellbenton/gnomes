import { generatePickupData } from '../helpers/generators.js';

class Pickup {
  constructor(initialPickupData) {
    this.id = Math.floor(Math.random() * 1000000)

    const pickupData = generatePickupData(initialPickupData)
    Object.keys(pickupData).forEach(key => {
      this[key] = pickupData[key]
    })
  }
}

export default Pickup;
