import { generateEnemyData } from '../helpers/generators.js';

class Enemy {
  constructor(initialEnemyData) {
    const enemyData = generateEnemyData(initialEnemyData)

    Object.keys(enemyData).forEach(key => {
      console.log(key, enemyData[key])
      this[key] = enemyData[key]
    })
  }
}

export default Enemy