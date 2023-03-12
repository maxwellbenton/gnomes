class PlayerPeer {
  constructor(player, peerId) {
    this.player = player
    this.id = peerId
    this.className = null
    this.connecting = false
    this.status = 'new'
    this.location = null
    this.connection = null

    this.stats = null
    this.position = null
    this.previousPosition = null
    this.weapon = null
    this.color = '#555555'
    this.name = 'Peer'
  }

  updatePosition(data) {
    // for smoothing out the movement
    // const midX = (this._peers[peerId].x ? (this._peers[peerId].x + data.x) / 2 : 0) + this._position.x
    // const midY = (this._peers[peerId].y ? (this._peers[peerId].y + data.y) / 2 : 0) + this._position.y
    // const midAngle = this._peers[peerId].viewAngle ? ((180 + this._peers[peerId].viewAngle + data.viewAngle) / 2) - 180 : 0
    this.previousPosition = this.position

    this.position = {
      ...this.position,
      ...data
    }
    this.status = 'active'
    this.lastUpdated = new Date().getTime()
    // console.log('updated position for', this.id, this.position)
  }

  updateData({ className, stats, weapon, data }) {
    this.className = className
    this.stats = stats
    this.weapon = weapon
    this.name = data.name
    this.color = data.color
  }

  sendData(data) {
    this.connection.send(data)
  }

  // sendInitialData() {
  //   this.sendData({
  //     type: 'data',
  //     topic: 'initialData',
  //     payload: {
  //       stats: { ...this.player.stats},
  //       // inventory: { ...this.player.inventory},
  //       // equipped: { ...this.player.equipped},
  //       status: this.player.status,
  //       class: this.player.class
  //     }
  //   })
  // }

  updateConnectionToPeer(connection) {
    this.connection = connection

    // this.sendInitialData()

    // on data received
    connection.on('data', ({ type, topic, payload }) => {
      if (topic === 'position') {
        this.updatePosition(payload.position)
      }

      if (topic === 'general') {
        this.updateData(payload)
        this.updatePosition(payload.position)
      }

      // if (topic === 'initialData') {
      //   this.stats = payload.stats
      //   // this.inventory = payload.inventory
      //   // this.equipped = payload.equipped
      //   this.status = payload.status
      //   this.class = payload.class
      // }

      // if (topic === 'stats') {
      //   this.stats = payload
      // }

      // if (topic === 'inventory') {
      //   this.inventory = payload
      // }

      // if (topic === 'equipped') {
      //   this.equipped = payload
      // }

      // if (topic === 'location') {
      //   this.location = payload
      // }

      // if (topic === 'status') {
      //   this.status = payload
      // }cc 
    });
  }

}


export default PlayerPeer