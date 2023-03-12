/* eslint-disable no-console */
import Game from './src/classes/game.js'

const game = new Game()



















// import Player from './src/classes/player.js';
// import Item from './src/classes/item.js';
// import P2PHandler from './src/p2p/index.js';
// import * as playerClasses from './src/classes/player-classes.js';
// import CanvasHandler from './src/classes/canvasHandler.js';

// const classes = Object.values(playerClasses)

// const PlayerClass = classes[Math.floor(Math.random() * classes.length)]

// const player = new PlayerClass()
// console.log('primary', player._equipped.weapons.primary)
// console.log('secondary', player._equipped.weapons.secondary)
// const p2pHandler = await new P2PHandler(player) // initiates heartbeat
// console.warn('p2pHandler', p2pHandler, p2pHandler.connectToPeer)


// const playerClassContainer = document.getElementById('player-class-container')
// const playerStatsContainer = document.getElementById('player-stats-container')
// const playerInventoryContainer = document.getElementById('player-inventory-container')
// const playerEquipmentContainer = document.getElementById('player-equipment-container')
// const playerActionsContainer = document.getElementById('player-actions-container')
// const gameDataContainer = document.getElementById('game-data-container')

// async function updateDisplay() {
//   playerClassContainer.innerHTML = ''
//   playerStatsContainer.innerHTML = ''
//   playerInventoryContainer.innerHTML = ''
//   playerEquipmentContainer.innerHTML = ''
//   playerActionsContainer.innerHTML = ''

//   // CLASS
//   const classDiv = document.createElement('div')
//   const idDiv = document.createElement('sm')
//   classDiv.innerText = player.constructor.name.replace('Gnome', '')
//   idDiv.innerText = player.id
//   playerClassContainer.appendChild(classDiv)
//   playerClassContainer.appendChild(idDiv)

//   // STATS
//   const statsToDisplay = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']
//   Object.keys(player.stats).forEach(stat => {
//   if (!statsToDisplay.includes(stat)) return
//   const statContainer = document.createElement('span')
//   statContainer.classList.add('stat-container')
//   const statName = document.createElement('span')
//   statName.classList.add('stat-name')
//   statName.innerText = stat.toUpperCase().slice(0, 3)
//   const statValue = document.createElement('span')
//   statValue.classList.add('stat-value')
//   statValue.innerText = player.stats[stat]
//   statContainer.appendChild(statName)
//   statContainer.appendChild(statValue)
//   playerStatsContainer.appendChild(statContainer)
//   })

//   // EQUIPMENT
//   Object.keys(player.equipment).forEach(equipmentType => {
//   Object.keys(player.equipment[equipmentType]).forEach(subType => {
//     if (!player.equipment[equipmentType][subType]) return
//     if (player.equipment[equipmentType][subType] === null) return
//     const equipmentContainer = document.createElement('span')
//     equipmentContainer.classList.add('equipment-container')
//     const equipmentName = document.createElement('button')
//     equipmentName.classList.add('equipment-name')
//     equipmentName.innerText = player.equipment[equipmentType][subType]._name
//     equipmentContainer.appendChild(equipmentName)
//     playerEquipmentContainer.appendChild(equipmentContainer)

//     equipmentName.addEventListener('click', () => {
//       if (equipmentType === 'weapons') {
//         player.unequipWeapon(subType)
//       }
//       if (equipmentType === 'armor') {
//         player.unequipArmor(subType)
//       }
//       updateDisplay()
//     })
//   })
//   })

//   // INVENTORY
//   Object.keys(player.inventory).forEach(item => {
//     const itemContainer = document.createElement('div')
//     itemContainer.classList.add('item-container')
//     const itemName = document.createElement('button')
//     itemName.classList.add('item-name')
//     itemName.innerText = player.inventory[item]._name
//     itemContainer.appendChild(itemName)
//     playerInventoryContainer.appendChild(itemContainer)

//     itemName.addEventListener('click', () => {
//       if (player.inventory[item]._type === 'weapon') {
//         player.equipWeapon(player.inventory[item])
//       }
//       if (player.inventory[item]._type === 'armor') {
//         player.equipArmor(player.inventory[item])
//       }
      

//       player.removeFromInventory(player.inventory[item])
//       updateDisplay()
//     })
//   })





//   // ACTIONS
//   if (player.activePeers.length > 0) {
//     Object.keys(player.inventory).forEach(item => {
//       const itemContainer = document.createElement('div')
//       itemContainer.classList.add('item-container')
//       const actionButton = document.createElement('button')
//       actionButton.classList.add('item-name')
//       actionButton.innerText = 'Give ' + player.inventory[item]._name
//       itemContainer.appendChild(actionButton)
//       playerActionsContainer.appendChild(itemContainer)
  
//       actionButton.addEventListener('click', () => {
//         console.log('give ' + player.inventory[item]._name)
//       })
//     })
//   }

//   // GLOBAL ACTIONS
//   gameDataContainer.innerHTML = ''
//   const peerIdInput = document.createElement('input')
//   peerIdInput.setAttribute('type', 'text')
//   peerIdInput.setAttribute('placeholder', 'Peer ID')
//   peerIdInput.setAttribute('id', 'input-peer-id')
//   const peerIdButton = document.createElement('button')
//   peerIdButton.innerText = 'Connect'
//   gameDataContainer.appendChild(peerIdInput)
//   gameDataContainer.appendChild(peerIdButton)
//   peerIdButton.addEventListener('click', () => {
//     console.log('connecting to peer', p2pHandler.connectToPeer)
//     p2pHandler.connectToPeer(peerIdInput.value)
//   })
// }

// updateDisplay()

// const canvasHandler = new CanvasHandler(player)

// const canvas = document.createElement('canvas')
// canvas.width = 1000
// canvas.height = 500

// const keysPressed = {}
// let playerX = Math.floor(Math.random() * canvas.width);
// let playerY = Math.floor(Math.random() * canvas.height);
// let mouseX = 0
// let mouseY = 0



// function startGame() {
  
  // const ctx = canvas.getContext('2d')
  
  // document.querySelector('#game').innerHTML = ""
  // document.querySelector('#game').appendChild(canvas)

  // let playerMouseXDiff = playerX - mouseX
  // let playerMouseYDiff = playerY - mouseY
  // let viewAngle = Math.atan2(playerMouseYDiff, playerMouseXDiff) * 180 / Math.PI


  // function drawBackground() {    
    
  // }

  // const color = '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')
  
  // function drawPlayer() {
  //   ctx.beginPath();
  //   ctx.arc(playerX, playerY, 10, 0, 2 * Math.PI);
  //   ctx.fillStyle = color
  //   ctx.fill();

  //   ctx.fillStyle = 'black'
  //   ctx.font = '20px serif';
  //   ctx.fillText(player._data.name, playerX + 10, playerY)
  // }

  // function drawWeapons() {
  //   console.log('viewAngle', viewAngle)
  // }

  // function drawPeers() {
  //   Object.keys(player.peers).forEach(peerId => {
  //     const peer = player.peers[peerId]
  //     if (peer.position) {
  //       if (peer.position.x && peer.position.y) {
  //         ctx.beginPath();
  //         ctx.arc(peer.position.x, peer.position.y, 10, 0, 2 * Math.PI);
  //         ctx.fillStyle = 'black'
  //         ctx.fill();
  //       }
        
  //     }
  //   })
  // }
  
  // function gameLoop() {
  //   update();
    
  //   // Clear the canvas
  //   ctx.clearRect(0, 0, canvas.width, canvas.height);

  //   drawBackground();
  //   drawPlayer();
  //   drawWeapons();
  //   drawPeers();
  //   window.requestAnimationFrame(gameLoop);
  // }

  // drawPlayer()
  
//   function update() {
//     playerMouseXDiff = playerX - mouseX
//     playerMouseYDiff = playerY - mouseY
//     viewAngle = Math.atan2(playerMouseYDiff, playerMouseXDiff) * 180 / Math.PI


//     // Move the player based on key events
//     if (keysPressed.ArrowUp || keysPressed.KeyW) {
//       playerY -= 5;
//     }
//     if (keysPressed.ArrowDown || keysPressed.KeyS) {
//       playerY += 5;
//     }
//     if (keysPressed.ArrowLeft || keysPressed.KeyA) {
//       playerX -= 5;
//     }
//     if (keysPressed.ArrowRight || keysPressed.KeyD) {
//       playerX += 5;
//     }
    
//     // Send the player's position to the server
//     player.updatePosition({
//       x: playerX,
//       y: playerY
//     })
//   }
//   gameLoop();
// }

// document.addEventListener('keydown', (event) => {
//   keysPressed[event.code] = true;
// });

// document.addEventListener('keyup', (event) => {
//   keysPressed[event.code] = false;
// });

// canvas.addEventListener('mousemove', (event) => {
//   keysPressed[event.code] = true;
// });


// startGame()
