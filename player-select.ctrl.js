import { Component } from './component.js'
import { PlayersManager } from './players-manager.js'
import { changeView } from './main.js'
import { Player } from './tic-tac-toe.js'

export class PlayerSelect extends Component {
  #$playerList = document.querySelector('.player-list')
  #$startButton = document.querySelector('.start-button')
  #$addPlayerButton = document.querySelector('.add-player')
  #$createPlayerModal = document.querySelector('#create-player-modal')
  #playersManager = new PlayersManager()
  
  #selectedPlayers = []
  constructor() {
    super()
    this.addEvent(this.#$playerList, 'click', this.#handlePlayerSelection.bind(this))
    this.addEvent(this.#$startButton, 'click', this.#start.bind(this))
    this.addEvent(this.#$addPlayerButton, 'click', this.#$openCreatePlayerModal.bind(this))
    this.#refreshPlayersList()
  }

  #refreshPlayersList() {
    const children = [...this.#$playerList.childNodes]
    const { players } = this.#playersManager

    const playersIds = players.map(player => player.id)
    const childrenIds = children.map(child => child.dataset.id)

    console.log(playersIds, childrenIds)

    const shouldBeDeleted = children.filter(({ dataset }) => !playersIds.includes(dataset.id))
    const shouldBeCreated = players.filter(({ id }) => !childrenIds.includes(id)).map(this.#$createPlayerTile.bind(this))

    console.log(shouldBeDeleted, shouldBeCreated)

    shouldBeDeleted.forEach(this.#$playerList.removeChild)
    this.#$playerList.append(...shouldBeCreated)
  }

  #start() {
    const players = this.#selectedPlayers.map(id => this.#playersManager.players.find(player => player.id === id))
    changeView('game', players)
  }

  #addNewPlayer(name, mark) {
    const player = new Player(name, mark)
    this.#playersManager.addPlayer(player)
    this.#refreshPlayersList()
  }

  #handlePlayerSelection({ target }) {
    const $player = target.closest('.player')
    if ($player) {
      const { id } = $player.dataset
      const value = !this.#selectedPlayers.includes(id)
      $player.classList.toggle('selected', value)
      if (value) {
        this.#selectedPlayers.push(id)
      } else {
        this.#selectedPlayers.splice(this.#selectedPlayers.indexOf(id), 1)
      }
  
      this.#$startButton.disabled = this.#selectedPlayers.length !== 2
    }
  }

  #$createPlayerTile({ name, score, id }) {
    const $container = document.createElement('li')
    $container.classList.add('player')
    $container.dataset.id = id
  
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
    this.addEvent($deleteButton, 'click', this.#$handleDeletePlayerTile.bind(this))
  
    $container.append($image, $name, $score, $deleteButton)

    return $container
  }

  #$handleDeletePlayerTile({ target }) {
    const $player = target.closest('.player')
    if ($player) {
      const { id } = $player.dataset
      this.#$playerList.removeChild($player)
      const selectedIndex = this.#selectedPlayers.indexOf(id)
      if (~selectedIndex) {
        this.#selectedPlayers.splice(selectedIndex, 1)
      }

      this.#playersManager.deletePlayer(id)

      this.#$startButton.disabled = this.#selectedPlayers.length !== 2
    }
  }

  #$openCreatePlayerModal(value) {
    this.#$createPlayerModal.hidden = !value
    const $name = document.querySelector('#player-name')
    const $mark = document.querySelector('#player-mark')
    const $createButton = document.querySelector('#create-player')
    if (value) {
      this.addEvent($createButton, 'click', () => {
        this.#addNewPlayer($name.value, $mark.value)
        this.#$openCreatePlayerModal(false)
      }, 'create-player')
    } else {
      $name.value = ''
      $mark.value = ''
      this.removeEvent('create-player')
    }
  }
}
