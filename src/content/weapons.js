function drawLine({ context, weapon: { width, color }, offsets: { start, end } }) {
  // console.log('drawLine', { width, color }, { start, end })
  context.lineWidth = width;
  context.beginPath();
  context.moveTo(start.x, start.y);
  context.lineTo(end.x, end.y);
  context.strokeStyle = color;
  context.stroke();
}

function calculatePointData(weapon, { viewAngle }, center) {
  const cosOfAngle = Math.cos((viewAngle + 180) * Math.PI / 180)
  const sinOfAngle = Math.sin((viewAngle + 180) * Math.PI / 180)
  const startOffset = weapon.length * weaponConstraints.start
  const endOffset = weapon.length * weaponConstraints.end

  return {
    start: {
      x: center.x + (startOffset * cosOfAngle),
      y: center.y + (startOffset * sinOfAngle)
    },
    end: {
      x: center.x + (endOffset * cosOfAngle),
      y: center.y + (endOffset * sinOfAngle)
    }
  }
}

const weaponConstraints = {
  start: 0.4,
  end: 2
}
const defaults = {
  type: 'weapon',
}

const weapons = {
  thornblade: {
    ...defaults,
    name: 'thornblade',
    description: 'A short sword with a hilt made of gnarled wood and thorns wrapped around it.',
    minDamage: 2,
    maxDamage: 6,
    minWeight: 1,
    maxWeight: 3,
    minSpeed: 8,
    maxSpeed: 25,
    length: 10,
    length: 35,
    width: 5,
    color: 'green',
    draw: ({ weapon, context, target, center }) => {
      const offsets = calculatePointData(weapon, target.position, center)
      
      drawLine({ weapon, context, offsets })
    }
  },
  pickaxe: {
    ...defaults,
    name: 'pickaxe',
    description: 'A long-hanlded tool with a curved and pointed piece of metal joined to it.',
    minDamage: 2,
    maxDamage: 3,
    minWeight: 3,
    maxWeight: 6,
    minSpeed: 1,
    maxSpeed: 4,
    minSpeed: 4,
    maxSpeed: 10,
    length: 25,
    width: 3,
    color: '#bbbbff',
    draw: ({ weapon, context, target, center }) => {
      const offsets = calculatePointData(weapon, target.position, center)
      
      drawLine({ weapon, context, offsets })
    }
  },
  mace: {
    ...defaults,
    name: 'mace',
    description: 'A short club with a metal ball on the end of it.',
    minDamage: 4,
    maxDamage: 6,
    minWeight: 4,
    maxWeight: 6,
    minSpeed: 1,
    maxSpeed: 4,
    minSpeed: 10,
    maxSpeed: 18,
    length: 20,
    width: 3,
    color: '#555555',
    draw: ({ weapon, context, target, center }) => {
      const offsets = calculatePointData(weapon, target.position, center)
      
      drawLine({ weapon, context, offsets })
    }
  },
  shortsword: {
    ...defaults,
    name: 'shortsword',
    description: 'A short sword with a hilt made of wood.',
    minDamage: 4,
    maxDamage: 6,
    minWeight: 3,
    maxWeight: 5,
    minSpeed: 2,
    maxSpeed: 5,
    minSpeed: 10,
    maxSpeed: 18,
    length: 20,
    width: 3,
    color: '#555555',
    draw: ({ weapon, context, target, center }) => {
      const offsets = calculatePointData(weapon, target.position, center)
      
      drawLine({ weapon, context, offsets })
    }
  },
  sword: {
    ...defaults,
    name: 'sword',
    description: 'A medium-length sword with a hilt made of wood.',
    minDamage: 6,
    maxDamage: 8,
    minWeight: 4,
    maxWeight: 6,
    minSpeed: 8,
    maxSpeed: 13,
    length: 20,
    width: 3,
    color: '#555555',
    imageUrl: './src/assets/images/weapons/sword.png',
    draw: ({ weapon, context, target, center }) => {
      const offsets = calculatePointData(weapon, target.position, center)
      
      drawLine({ weapon, context, offsets })
    }
  },
  longsword: {
    ...defaults,
    name: 'longsword',
    description: 'A long sword with a hilt made of wood.',
    minDamage: 8,
    maxDamage: 10,
    minWeight: 5,
    maxWeight: 7,
    minSpeed: 5,
    maxSpeed: 10,
    length: 20,
    width: 3,
    color: '#555555',
    imageUrl: './src/assets/images/weapons/axe.png',
    draw: ({ weapon, context, target, center }) => {
      const offsets = calculatePointData(weapon, target.position, center)
      
      drawLine({ weapon, context, offsets })
    }
  },
  dagger: {
    ...defaults,
    name: 'dagger',
    description: 'A short blade with a hilt made of wood.',
    minDamage: 3,
    maxDamage: 5,
    minWeight: 1,
    maxWeight: 2,
    minSpeed: 8,
    maxSpeed: 20,
    length: 10,
    width: 3,
    color: '#555555',
    draw: ({ weapon, context, target, center }) => {
      const offsets = calculatePointData(weapon, target.position, center)
      
      drawLine({ weapon, context, offsets })
    }
  },
  staff: {
    ...defaults,
    name: 'staff',
    description: 'A long, thin, sturdy branch of wood with a gnarled top.',
    minDamage: 3,
    maxDamage: 5,
    minWeight: 4,
    maxWeight: 6,
    minSpeed: 5,
    maxSpeed: 9,
    length: 35,
    width: 3,
    color: '#555555',
    imageUrl: './src/assets/images/weapons/greatsword.png',
    draw: ({ weapon, context, target, center }) => {
      const offsets = calculatePointData(weapon, target.position, center)
      
      drawLine({ weapon, context, offsets })
    }
  },
  bow: {
    ...defaults,
    name: 'bow',
    description: 'A curved piece of wood with a string attached to it.',
    minDamage: 3,
    maxDamage: 5,
    minWeight: 2,
    maxWeight: 4,
    minSpeed: 6,
    maxSpeed: 10,
    length: 1,
    width: 3,
    color: '#555555',
    draw: ({ weapon, context, target, center }) => {
      const offsets = calculatePointData(weapon, target.position, center)
      
      drawLine({ weapon, context, offsets })
    }
  },
  crossbow: {
    ...defaults,
    name: 'crossbow',
    description: 'A long, curved piece of wood with a string attached to it.',
    minDamage: 4,
    maxDamage: 6,
    minWeight: 4,
    maxWeight: 6,
    minSpeed: 4,
    maxSpeed: 8,
    length: 0,
    width: 3,
    color: '#555555',
    draw: ({ weapon, context, target, center }) => {
      const offsets = calculatePointData(weapon, target.position, center)
      
      drawLine({ weapon, context, offsets })
    }
  },
  sling: {
    ...defaults,
    name: 'sling',
    description: 'A piece of leather with a pouch attached to it.',
    minDamage: 2,
    maxDamage: 4,
    minWeight: 1,
    maxWeight: 2,
    minSpeed: 8,
    maxSpeed: 11,
    length: 0,
    width: 3,
    color: '#555555',
    draw: ({ weapon, context, target, center }) => {
      const offsets = calculatePointData(weapon, target.position, center)
      
      drawLine({ weapon, context, offsets })
    }
  },
  axe: {
    ...defaults,
    name: 'axe',
    description: 'A short, curved blade with a hilt made of wood.',
    minDamage: 2,
    maxDamage: 4,
    minWeight: 3,
    maxWeight: 5,
    minSpeed: 7,
    maxSpeed: 10,
    length: 25,
    width: 3,
    color: '#555555',
    draw: ({ weapon, context, target, center }) => {
      const offsets = calculatePointData(weapon, target.position, center)
      
      drawLine({ weapon, context, offsets })
    }
  },
  hammer: {
    ...defaults,
    name: 'hammer',
    description: 'A short, curved blade with a hilt made of wood.',
    minDamage: 2,
    maxDamage: 4,
    minWeight: 3,
    maxWeight: 5,
    minSpeed: 7,
    maxSpeed: 9,
    length: 20,
    width: 3,
    color: '#555555',
    draw: ({ weapon, context, target, center }) => {
      const offsets = calculatePointData(weapon, target.position, center)
      
      drawLine({ weapon, context, offsets })
    }
  },
  spear: {
    ...defaults,
    name: 'spear',
    description: 'A long, thin, sturdy branch of wood with a pointed metal tip.',
    minDamage: 2,
    maxDamage: 4,
    minWeight: 3,
    maxWeight: 5,
    minSpeed: 4,
    maxSpeed: 8,
    length: 40,
    width: 3,
    color: '#555555',
    draw: ({ weapon, context, target, center }) => {
      const offsets = calculatePointData(weapon, target.position, center)
      
      drawLine({ weapon, context, offsets })
    }
  },
  halberd: {
    ...defaults,
    name: 'halberd',
    description: 'A long, sturdy branch of wood with an axe blade and a spear tip attached to it.',
    minDamage: 5,
    maxDamage: 7,
    minWeight: 6,
    maxWeight: 8,
    minSpeed: 3,
    maxSpeed: 6,
    length: 45,
    width: 3,
    color: '#555555',
    draw: ({ weapon, context, target, center }) => {
      const offsets = calculatePointData(weapon, target.position, center)
      
      drawLine({ weapon, context, offsets })
    }
  },
  flail: {
    ...defaults,
    name: 'flail',
    description: 'A short, sturdy branch of wood with a spiked ball attached to it by a chain.',
    minDamage: 4,
    maxDamage: 6,
    minWeight: 4,
    maxWeight: 6,
    minSpeed: 3,
    maxSpeed: 8,
    length: 35,
    width: 3,
    color: '#555555',
    draw: ({ weapon, context, target, center }) => {
      const offsets = calculatePointData(weapon, target.position, center)
      
      drawLine({ weapon, context, offsets })
    }
  },
  scythe: {
    ...defaults,
    name: 'scythe',
    description: 'A long, curved blade with a hilt made of wood.',
    minDamage: 2,
    maxDamage: 4,
    minWeight: 3,
    maxWeight: 5,
    minSpeed: 3,
    maxSpeed: 5,
    length: 40,
    width: 3,
    color: '#555555',
    draw: ({ weapon, context, target, center }) => {
      const offsets = calculatePointData(weapon, target.position, center)
      
      drawLine({ weapon, context, offsets })
    }
  },
  warhammer: {
    ...defaults,
    name: 'warhammer',
    description: 'A hammer, but really big.',
    minDamage: 9,
    maxDamage: 11,
    minWeight: 7,
    maxWeight: 9,
    minSpeed: 2,
    maxSpeed: 5,
    length: 45,
    width: 3,
    color: '#555555',
    draw: ({ weapon, context, target, center }) => {
      const offsets = calculatePointData(weapon, target.position, center)
      
      drawLine({ weapon, context, offsets })
    }
  },
  greatsword: {
    ...defaults,
    name: 'greatsword',
    description: 'A really big sword.',
    minDamage: 9,
    maxDamage: 11,
    minWeight: 7,
    maxWeight: 9,
    minSpeed: 2,
    maxSpeed: 5,
    length: 45,
    width: 3,
    color: '#555555',
    imageUrl: './src/assets/images/weapons/greatsword.png',
    draw: ({ weapon, context, target, center }) => {
      const offsets = calculatePointData(weapon, target.position, center)
      
      drawLine({ weapon, context, offsets })
    }
  },
  greataxe: {
    ...defaults,
    name: 'greataxe',
    description: 'A really big axe.',
    minDamage: 7,
    maxDamage: 9,
    minWeight: 7,
    maxWeight: 9,
    minSpeed: 2,
    maxSpeed: 4,
    length: 45,
    width: 3,
    color: '#555555',
    draw: ({ weapon, context, target, center }) => {
      console.error({weapon, context, target, center})
      const offsets = calculatePointData(weapon, target.position, center)
      
      drawLine({ weapon, context, offsets })
    }
  },
  greatclub: {
    ...defaults,
    name: 'greatclub',
    description: 'A really big club.',
    minDamage: 7,
    maxDamage: 9,
    minWeight: 7,
    maxWeight: 9,
    minSpeed: 2,
    maxSpeed: 4,
    length: 45,
    width: 3,
    color: '#555555',
    draw: ({ weapon, context, target, center }) => {
      const offsets = calculatePointData(weapon, target.position, center)
      
      drawLine({ weapon, context, offsets })
    }
  },
  greatflail: {
    ...defaults,
    name: 'greatflail',
    description: 'A really big flail.',
    minDamage: 7,
    maxDamage: 9,
    minWeight: 7,
    maxWeight: 9,
    minSpeed: 1,
    maxSpeed: 4,
    length: 45,
    width: 3,
    color: '#555555',
    draw: ({ weapon, context, target, center }) => {
      const offsets = calculatePointData(weapon, target.position, center)
      
      drawLine({ weapon, context, offsets })
    }
  },
  glaive: {
    ...defaults,
    name: 'glaive',
    description: 'A long, sturdy branch of wood with a sword attached to the end of it.',
    minDamage: 7,
    maxDamage: 9,
    minWeight: 7,
    maxWeight: 9,
    minSpeed: 1,
    maxSpeed: 4,
    length: 50,
    width: 3,
    color: '#555555',
    draw: ({ weapon, context, target, center }) => {
      const offsets = calculatePointData(weapon, target.position, center)
      
      drawLine({ weapon, context, offsets })
    }
  }
}

export default weapons