import { Player } from './tic-tac-toe.js'

export class PlayersManager {
  #storageKey = 'players'
  constructor() {
    this.players = []
    this.#loadPlayers()
  }

  addPlayer(player) {
    this.players.push(player)
    this.#savePlayers()
  }

  #loadPlayers() {
    const data = JSON.parse(localStorage.getItem(this.#storageKey))
    if (!data) {
      return []
    }
    this.players = data.map(datum => {
      const obj = Object.create(Player.prototype)
      return Object.assign(obj, datum)
    })
    return this.players
  }

  #savePlayers() {
    const data = JSON.stringify(this.players)
    localStorage.setItem(this.#storageKey, data)
    return this.players
  }

  deletePlayer(player) {
    const index = this.players.findIndex(player)
    this.players.splice(index, 1)
    this.#savePlayers()
  }
}
