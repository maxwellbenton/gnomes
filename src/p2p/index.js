import { checkParamsFor } from '../helpers/index.js'
import PlayerPeer from '../classes/player-peer.js'

class P2PHandler {
  constructor(player) {
    this.player = player;
    this.player.p2pHandler = this;
    this.peer = null
    this.peerList = [
      ...Object.keys(this.player.friends),
      ...Object.keys(this.player.acquaintances)
    ]

    try {
      this.peer = new Peer(player.id);
    } catch (e) {
      console.error('Failed to find Peer class. Check internet connection.')
      return
    }

    this.connectToSignalingServer()
      .then(id => {
        console.log('Connected to signaling server with ID:', id)
        
        
        this.updatePeerList()
        this.attemptConnectionToParamPeer()
        
        this.startGeneralListener()
        this.startCheckin()
        this.startHeartbeat()
      })
  }

  async connectToSignalingServer() {
    return new Promise((resolve, reject) => {
      this.peer.on('open', (id) => {
        resolve(id)
      })
    })
  }

  attemptConnectionToParamPeer() {
    const peerId = checkParamsFor('peer')
    if (peerId) {
      console.log('Peer param found in URL', peerId)
      if (!this.player.acquaintances[peerId]) {
        console.log('You are not acquainted with', peerId)
        this.player.addAcquaintance(new PlayerPeer(this.player, peerId))
      } else {
        console.log('Already acquainted with peer', peerId)
      }
    }
  }

  startCheckin() {
    console.log('Starting checkin')
    setInterval(() => {
      this.peerList.forEach(peerId => {
        const peer = this.player.acquaintances[peerId]
        if (
          peer.connection
        ) {
          // console.log('Sending general data update to', peerId)
          // peer.sendInitialData()
          return
        }

        if (peer.connecting) { 
          console.log('Already connecting to', peerId)
          return 
        }

        peer.connecting = true
        this.connectToPeer(peerId)
      })
    }, 5000)
  }

  startHeartbeat() {
    console.log('Starting heartbeat interval')
    let counter = 0
    setInterval(() => {
      this.peerList.forEach(peerId => {
        const peer = this.player.acquaintances[peerId]
        if (peer.connecting) {
          console.log('Still connecting to', peerId)
          return
        }

        if (!peer.connection) {
          console.log('Not connected to', peerId)
          return
        }

        let data
        if (counter % 20 === 0) {
          // general data
          const { draw, ...weapon } = this.player.equipped.weapons.primary
          data = {
            type: 'heartbeat',
            topic: 'general',
            payload: {
              position: this.player.position,
              className: this.player.className,
              weapon,
              data: this.player.data,
              stats: this.player.stats
            }
          }
          counter = 0
        } else {
          // minimal data
          data = {
            type: 'heartbeat',
            topic: 'position',
            payload: {
              position: this.player.position
            }
          }
        }

        peer.sendData(data)
        counter += 1
      })
    }, 100)
  }

  updatePeerList() {
    console.log('Starting peerlist updater')
    setInterval(() => {
      this.peerList = [
        ...Object.keys(this.player.friends),
        ...Object.keys(this.player.acquaintances)
      ]
    }, 1000)
  }

  async connectToPeer(peerId) {
    const dataConnection = this.peer.connect(peerId);
    console.warn(dataConnection)
    dataConnection.on('open', () => {
      console.log('Connected to', peerId)
      if (this.player.acquaintances[peerId]) {
        this.player.acquaintances[peerId].connecting = false
      } else {
        this.player.addAcquaintance(new PlayerPeer(this.player, peerId))
      }
      this.player.acquaintances[peerId].updateConnectionToPeer(dataConnection)
    })

    dataConnection.on('error', (err) => {
      console.error('Failure of connection to', peerId, err)
      delete this.player.acquaintances[peerId]
    })

    dataConnection.on('close', (err) => {
      console.error('Connection closed for', peerId, err)
    })
  }

  startGeneralListener() {
    this.peer.on('connection', (dataConnection) => {
      console.log('Incoming connection from', dataConnection.peer);
      
      const peerId = dataConnection.peer
      if (!this.player.acquaintances[peerId]) {
        this.player.addAcquaintance(new PlayerPeer(this.player, peerId))
      } 
      this.player.acquaintances[peerId].updateConnectionToPeer(dataConnection)
    });
  }
}

export default P2PHandler;