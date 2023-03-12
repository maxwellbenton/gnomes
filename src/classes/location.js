import { generateLocationData } from '../helpers/generators.js';

class Location {
  constructor(initialLocationData) {
    const locationData = generateLocationData(initialLocationData)
    Object.keys(locationData).forEach(key => {
      console.log(key, locationData[key])
      this[key] = locationData[key]
    })
  }
}

export default Location