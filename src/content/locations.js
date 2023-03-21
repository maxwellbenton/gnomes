const defaults = {
  type: 'enemy',
  name: 'Debug Arena',
  description: 'A debug arena.',
  backgroundUrl: './src/assets/images/backgrounds/debug.png',
  width: 1028,
  height: 1028,
  startingX: 512,
  startingY: 512,
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

export const locations = {
  debugArena: {
    ...defaults
  },
  home: {
    ...defaults,
    name: 'home',
    description: 'home',
    backgroundUrl: './src/assets/images/backgrounds/home.png',
    width: 512,
    height: 512,
    startingX: 256,
    startingY: 256,
    level: 1,
    levels: {
      1: {
        spawnRate: 0,
        spawnRateIncrease: 0,
        spawnRateIncreaseInterval: 0,
        enemyLimit: 1
      }
    }
  },
  forest: {
    ...defaults,
    name: 'forest',
    description: 'forest',
    backgroundUrl: './src/assets/images/backgrounds/forest.png'
  },
  beach: {
    ...defaults,
    name: 'beach',
    description: 'beach',
    backgroundUrl: './src/assets/images/backgrounds/beach.png'
  },
  flatlands: {
    ...defaults,
    name: 'flatlands',
    description: 'flatlands',
    backgroundUrl: './src/assets/images/backgrounds/flatlands.png'
  },
  field: {
    ...defaults,
    name: 'field',
    description: 'field',
    backgroundUrl: './src/assets/images/backgrounds/field.png'
  },
  beach: {
    ...defaults,
    name: 'beach',
    description: 'beach',
    backgroundUrl: './src/assets/images/backgrounds/beach.png'
  },
  dirt: {
    ...defaults,
    name: 'dirt',
    description: 'dirt',
    backgroundUrl: './src/assets/images/backgrounds/dirt.png'
  }
}