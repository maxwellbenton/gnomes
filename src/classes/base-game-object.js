class BaseGameObject {
  constructor(initialData, generateData) {
    this.id = Math.floor(Math.random() * 1000000)
    
    const generatedData = generateData(initialData)
    Object.keys(generatedData).forEach(key => {
      this[key] = generatedData[key]
    })
  }
}

export default BaseGameObject;
