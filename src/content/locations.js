const defaults = {
  type: 'enemy',
}

export const locations = {
  debugArena: {
    ...defaults,
    name: 'Debug Arena',
    description: 'A debug arena.',
    width: 1000,
    height: 1000,
    startingX: 500,
    startingY: 500,
    level: 1,
    levels: {
      1: {
        spawnRate: 1,
        spawnRateIncrease: 0,
        spawnRateIncreaseInterval: 0,
        // enemies: []
      }
    }
  }
}