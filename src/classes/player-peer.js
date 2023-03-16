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
    this.newPosition = null
    this.weapon = null
    this.color = '#555555'
    this.name = 'Peer'
  }

  updatePosition(data) {
    // for smoothing out the movement
    // const midX = (this._peers[peerId].x ? (this._peers[peerId].x + data.x) / 2 : 0) + this._position.x
    // const midY = (this._peers[peerId].y ? (this._peers[peerId].y + data.y) / 2 : 0) + this._position.y
    // const midAngle = this._peers[peerId].viewAngle ? ((180 + this._peers[peerId].viewAngle + data.viewAngle) / 2) - 180 : 0
    // this.previousPosition = this.position

    this.newPosition = {
      ...this.position,
      ...data
    }
    this.status = 'active'
    this.lastUpdated = new Date().getTime()
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

  updateConnectionToPeer(connection) {
    this.connection = connection

    // on data received
    connection.on('data', ({ type, topic, payload }) => {
      if (topic === 'position') {
        this.updatePosition(payload.position)
      }

      if (topic === 'general') {
        this.updateData(payload)
        this.updatePosition(payload.position)
      }
    });
  }

}


export default PlayerPeer