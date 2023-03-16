export class InventoryHandler {
  constructor(player) {
    this.player = player
    this.items = []
  }

  add(item) {
    if (this.player.totalWeight + item.weight > this.player.stats.carryWeight) {
      throw new Error('You cannot carry that much weight!');
    }
    
    this.items.push(item);
    
  }

  remove(item) {
    if (this.items.includes(item)) {
      this.items.splice(this.items.indexOf(item), 1);
      
    } else {
      throw new Error('You do not have that item!');
    }
  }
}