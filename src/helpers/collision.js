import Pickup from '../classes/pickup.js'
import {
  generatePickupData
} from './generators.js'

export function pickupHitDetection({ objects, player, offsetX, offsetY }) {
  Object.keys(objects).forEach(pickupId => {
    objects[pickupId].forEach(pickup => {
      const pickupX = offsetX + pickup.x
      const pickupY = offsetY + pickup.y
      const playerX = offsetX + player.position.x
      const playerY = offsetY + player.position.y

      if (playerX > pickupX - 100 && playerX < pickupX + 100 && playerY > pickupY - 100 && playerY < pickupY + 100) {
        pickup.x += (playerX - pickupX) > 0 ? 5 : -5
        pickup.y += (playerY - pickupY) > 0 ? 5 : -5
      }

      if (playerX > pickupX - 16 && playerX < pickupX + 16 && playerY > pickupY - 16 && playerY < pickupY + 16) {
        objects[pickupId].splice(objects[pickupId].indexOf(pickup), 1)
        player.inventory.items.push(pickup)
      }
    })
  })
}

export function weaponHitDetection({ objects, player, offsetX, offsetY, center, game }) {
  Object.keys(objects).forEach(envObjectsId => {
    objects[envObjectsId].forEach(envObject => {
      if (!player.equipped.weapons.primary.offsets) return
      const envObjectX = envObject.x
      const envObjectY = envObject.y
      const playerX = player.position.x
      const playerY = player.position.y
      if (playerX > envObjectX - 30 && playerX < envObjectX + 30 && playerY > envObjectY - 30 && playerY < envObjectY + 30) {
        // console.warn(envObject)
        const offsets = player.equipped.weapons.primary.offsets
        // console.warn(envObjectX, envObject  , player.equipped.weapons.primary.offsets)

        Object.keys(offsets).forEach(offsetType => {
          Object.keys(offsets[offsetType]).forEach(point => {
            const offsetPointX = center.x - offsets[offsetType][point].tx + player.position.x
            const offsetPointY = center.y - offsets[offsetType][point].ty + player.position.y
            if (
              offsetPointX > envObjectX 
              && offsetPointX < envObjectX + 16 
              && offsetPointY > envObjectY 
              && offsetPointY < envObjectY + 30
            ) {
              game.addPickup(new Pickup({ x: envObject.x, y: envObject.y }, generatePickupData))
              objects[envObjectsId] = objects[envObjectsId].filter(obj => obj.id !== envObject.id)
            }
          })
        })


      }

      // if (playerX > envObjectsX - 16 && playerX < envObjectsX + 16 && playerY > envObjectsY - 16 && playerY < envObjectsY + 16) {
      //   objects[envObjectsId].splice(game.envObjects[envObjectsId].indexOf(envObjects), 1)
      //   player.inventory.items.push(envObjects)
      // }
    })
  })
}

// export function weaponHitDetection({ object, weapon, offsetX, offsetY, center, game }) {
  // return hitTestRectangle(object, {
  //   x: center.x - 8,
  //   y: center.y - 8,
  //   width: 16,
  //   height: 16
  // })
// }

export function inPlayerArea({ object, center }) {
  return hitTestRectangle(object, {
    x: center.x - 50,
    y: center.y - 50,
    width: 100,
    height: 100
  })
}

export function playerHitDetection({ object, center }) {
  return hitTestRectangle(object, {
    x: center.x - 8,
    y: center.y - 8,
    width: 16,
    height: 16
  })
}

function hitTestRectangle(r1, r2) {

  //Define the variables we'll need to calculate
  let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

  //hit will determine whether there's a collision
  hit = false;

  //Find the center points of each sprite
  r1.centerX = r1.x + r1.width / 2;
  r1.centerY = r1.y + r1.height / 2;
  r2.centerX = r2.x + r2.width / 2;
  r2.centerY = r2.y + r2.height / 2;

  //Find the half-widths and half-heights of each sprite
  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;

  //Calculate the distance vector between the sprites
  vx = r1.centerX - r2.centerX;
  vy = r1.centerY - r2.centerY;

  //Figure out the combined half-widths and half-heights
  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  combinedHalfHeights = r1.halfHeight + r2.halfHeight;

  //Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {

    //A collision might be occurring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {

      //There's definitely a collision happening
      hit = true;
    } else {

      //There's no collision on the y axis
      hit = false;
    }
  } else {

    //There's no collision on the x axis
    hit = false;
  }

  //`hit` will be either `true` or `false`
  return hit;
};