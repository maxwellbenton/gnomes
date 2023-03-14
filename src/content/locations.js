const defaults = {
  type: 'enemy',
}

export const locations = {
  debugArena: {
    ...defaults,
    name: 'Debug Arena',
    description: 'A debug arena.',
    backgroundUrl: './src/assets/images/backgrounds/debug-arena.png',
    width: 1028,
    height: 1028,
    startingX: 500,
    startingY: 500,
    level: 1,
    levels: {
      1: {
        spawnRate: 1000,
        spawnRateIncrease: 0,
        spawnRateIncreaseInterval: 0,
        enemyLimit: 100
      }
    }
  }
}