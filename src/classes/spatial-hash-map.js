export default class SpatialHashMap {
  constructor(width, height) {
    this.cellSize = {
      height: height,
      width: width
    }
    this.map = new Map();
  }

  insert(obj, bounds) {
    let cells = this.getCells(obj, bounds);
    for (let cell of cells) {
      if (!this.map.has(cell)) {
        this.map.set(cell, []);
      }

      this.map.get(cell).push(obj);
    }
  }

  getCells(obj, bounds) {
    if (
      obj.x + obj.width < bounds.left 
      || obj.y + obj.height < bounds.top
      || obj.x > bounds.right
      || obj.y > bounds.bottom
    ) {
      return [];
    }

    let x1 = Math.floor(obj.x - bounds.left / this.cellSize.width);
    let y1 = Math.floor(obj.y - bounds.top / this.cellSize.height);
    let x2 = Math.floor((obj.x - bounds.left + obj.width) / this.cellSize.width);
    let y2 = Math.floor((obj.y - bounds.top + obj.height) / this.cellSize.height);
    let cells = [];

    for (let x = x1; x <= x2; x++) {
      for (let y = y1; y <= y2; y++) {
        cells.push(`${x},${y}`);
      }
    }
    return cells;
  }

  getObjectsInRegion(x, y, width, height) {
    let cells = this.getCells({ x, y, width, height }, bounds);
    let objects = [];
    for (let cell of cells) {
      if (this.map.has(cell)) {
        objects.push(...this.map.get(cell));
      }
    }
    return objects;
  }
}