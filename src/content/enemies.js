const defaults = {
  type: 'enemy',
}

export const enemies = {
  square: {
    ...defaults,
    name: 'Square',
    description: 'A square.',
    level: 1,
    levels: {
      1: {
        healthPoints: 10,
        armorRating: 0,
        damage: 1,
        speed: 1,
        width: 10,
        height: 10,
        color: 'red',
        
      }
    },
    draw: (context, enemy, center) => {
      context.fillStyle = enemy.color
      context.fillRect(center.x - enemy.width / 2, center.y - enemy.height / 2, enemy.width, enemy.height)
    }
  }
}