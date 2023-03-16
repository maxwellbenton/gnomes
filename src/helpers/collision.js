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