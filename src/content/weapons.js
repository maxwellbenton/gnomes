function drawLine({ 
  context, 
  weapon: { 
    width, 
    color 
  }, 
  start,
  end
}) {
  context.lineWidth = width;
  context.beginPath();
  context.moveTo(start.x, start.y);
  context.lineTo(end.x, end.y);
  context.strokeStyle = color;
  context.stroke();
}

function calculatePointData(length, angle, center) {
  const cos = (length * Math.cos((angle - 180) * Math.PI / 180))
  const sin = (length * Math.sin((angle - 180) * Math.PI / 180))

  return {
    x: center.x + cos,
    y: center.y + sin,
    tx: center.x - cos,
    ty: center.y - sin
  }
}

const weaponConstraints = {
  start: 0.4,
  end: 2
}

const defaults = {
  type: 'weapon',
  name: 'WEAPON',
  description: 'A default weapon.',
  minDamage: 1,
  maxDamage: 5,
  minWeight: 1,
  maxWeight: 5,
  minSpeed: 1,
  maxSpeed: 5,
  length: 50,
  width: 5,
  color: 'grey',
  imageUrl: './src/assets/images/weapons/greatsword.png',
  draw: ({ weapon, context, offsets }) => {
    drawLine({ weapon, context, start: offsets.centerOffsets.base, end: offsets.centerOffsets.tip })
  },
  getHitboxPoints: ({ weapon: { length }, target: { position: { viewAngle }}, center }) => {
    return {
      centerOffsets: {
        base: calculatePointData(length * 0.1, viewAngle, center),
        mid: calculatePointData(length / 2, viewAngle, center),
        threeQuarters: calculatePointData(length * 0.75, viewAngle, center),
        tip: calculatePointData(length, viewAngle, center),
      }
    }
  }
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
    length: 35,
    width: 5,
    color: 'green'
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
    color: '#bbbbff'
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
    color: '#555555'
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
    color: '#555555'
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
    color: '#555555'
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
    color: '#555555'
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
    color: '#555555'
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
    color: '#555555'
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
    color: '#555555'
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
    color: '#555555'
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
    color: '#555555'
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
    color: '#555555'
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
    color: '#555555'
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
    color: '#555555'
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
    color: '#555555'
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
    color: '#555555'
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
    color: '#555555'
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
    color: '#555555'
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
    color: '#555555'
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
    color: '#555555'
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
    color: '#555555'
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
    color: '#555555'
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
    color: '#555555'
  }
}

export default weapons