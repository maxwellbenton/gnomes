import { generateLocationData } from '../helpers/generators.js';

class Location {
  constructor(initialLocationData) {
    const locationData = generateLocationData(initialLocationData)
    Object.keys(locationData).forEach(key => {
      this[key] = locationData[key]
    })
  }
}

export default Location