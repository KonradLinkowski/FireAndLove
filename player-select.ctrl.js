import { PlayersManager } from './players-manager.js'
import { changeView } from './main.js'

export class PlayerSelect {
  #$playerList = document.querySelector('.player-list')
  #$startButton = document.querySelector('.start-button')
  #playersManager = new PlayersManager()
  
  #selectedPlayers = []
  constructor() {
    const $playersTiles = this.#playersManager.players.map(this.#$createPlayerTile.bind(this))
    this.#$playerList.append(...$playersTiles)
    this.#$playerList.addEventListener('click', this.#handlePlayerSelection.bind(this))
    this.#$startButton.addEventListener('click', this.#start.bind(this))
  }

  #start() {
    const players = this.#selectedPlayers.map(index => this.#playersManager.players[index])
    changeView('game', players)
  }

  #handlePlayerSelection({ target }) {
    const $player = target.closest('.player')
    if ($player) {
      const index = +$player.dataset.index
      const value = !this.#selectedPlayers.includes(index)
      $player.classList.toggle('selected', value)
      if (value) {
        this.#selectedPlayers.push(index)
      } else {
        this.#selectedPlayers.splice(this.#selectedPlayers.indexOf(index), 1)
      }
  
      this.#$startButton.disabled = this.#selectedPlayers.length !== 2
    }
  }

  #$createPlayerTile({ name, score }, index) {
    const $container = document.createElement('li')
    $container.classList.add('player')
    $container.dataset.index = index
  
    const $image = document.createElement('img')
    $image.classList.add('player__image')
  
    const $name = document.createElement('span')
    $name.classList.add('player__name')
    $name.textContent = name
  
    const $score = document.createElement('span')
    $score.classList.add('player__score')
    $score.textContent = score + ' pts'
  
    const $deleteButton = document.createElement('button')
    $deleteButton.classList.add('player__delete')
    $deleteButton.textContent = 'x'
  
    $container.append($image, $name, $score, $deleteButton)
  
    return $container
  }
}
