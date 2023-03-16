import { generateEnvObjectData } from '../helpers/generators.js';

class EnvObject {
  constructor(initialEnvObjectData) {
    this.id = Math.floor(Math.random() * 1000000)

    const envObjectData = generateEnvObjectData(initialEnvObjectData)
    Object.keys(envObjectData).forEach(key => {
      this[key] = envObjectData[key]
    })
  }
}

export default EnvObject;
