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
    states: {
      spawning: {
        animation: {},
        act({ 
          sprite, 
          dice, 
          player, 
          center
        }) {
          sprite.alpha += 0.01
          if (sprite.alpha > 1) {
            sprite.alpha = 1
            sprite.state = 'attack'
          }
        }
      },
      idle: {
        animation: {},
        act({ 
          sprite, 
          dice, 
          player, 
          center
        }) {
        //   if (dice[0] > 3) sprite.state = 'attack'
        //   if (dice[2] === 6) {
        //     sprite.vx += 1
        //     if (sprite.vx > 1) sprite.vx = 1
        //   } else if (dice[2] === 1) {
        //     sprite.vx -= 1
        //     if (sprite.vx < -1) sprite.vx = -1
        //   } else {
        //     sprite.vx = 0
        //   }

        //   if (dice[3] === 6) {
        //     sprite.vy += 1
        //     if (sprite.vy > 1) sprite.vy = 1
        //   } else if (dice[3] === 1) {
        //     sprite.vy -= 1
        //     if (sprite.vy < -1) sprite.vy = -1
        //   } else {
        //     sprite.vy = 0
        //   }
        }
      },
      attack: {
        animation: {},
        act({ 
          sprite, 
          dice, 
          player, 
          center
        }) {
          // if (
          //   sprite.x - center.x < 16 && sprite.x - center.x > -16
          //   && sprite.y - center.y < 16 && sprite.y - center.y > -16
          // ) {
          //   sprite.state = 'flee'
          // }

          // if (Math.random() > 0.5) return
          // if (player.position.rx > sprite.rx) {
          //   sprite.vx += 0.5
          //   if (sprite.vx > 5) sprite.vx = 5
          // } else {
          //   sprite.vx -= 0.5
          //   if (sprite.vx < -5) sprite.vx = -5
          // }

          // if (player.position.ry > sprite.ry) {
          //   // console.warn('player is above sprite', player.position.ry, sprite.ry)
          //   sprite.vy += 0.1
          //   if (sprite.vy > 1) sprite.vy = 1
          // } else {
          //   // console.warn('player is below sprite', player.position.ry, sprite.ry)
          //   sprite.vy -= 0.1
          //   if (sprite.vy < -1) sprite.vy = -1
          // }
        }
      },
      flee: {
        animation: {},
        act({ 
          sprite, 
          dice, 
          player, 
          center
        }) {
          if (Math.random()  > 1) return
          if (player.position.rx > sprite.rx) {
            sprite.vx -= 0.5
            if (sprite.vx > 5) sprite.vx = 5
          } else {
            sprite.vx += 0.5
            if (sprite.vx < -5) sprite.vx = -5
          }

          if (player.position.ry > sprite.ry) {
            sprite.vy -= 0.5
            if (sprite.vy > 5) sprite.vy = 5
          } else {
            sprite.vy += 0.5
            if (sprite.vy < -5) sprite.vy = -5
          }

          if (
            Math.abs(sprite.rx - player.position.rx) > 500
            && Math.abs(sprite.ry - player.position.ry) > 500
          ) {
            sprite.state = 'attack'
          }
        }
      },
      dead: {
        animation: {},
        act({ sprite }, game, app) {
          sprite.alpha -= 0.1
          if (sprite.alpha < 0) {
            sprite.alpha = 0
          }
          app.stage.removeChild(sprite)
          delete game.enemies[sprite.id]
        },
      },
    },
    draw: (context, enemy, center) => {
      context.fillStyle = enemy.color
      context.fillRect(center.x - enemy.width / 2, center.y - enemy.height / 2, enemy.width, enemy.height)
    }
  }
}