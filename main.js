import { PlayerSelect } from './player-select.ctrl.js'
import { GameManager } from './game.ctrl.js'

const views = {
  game: {
    $element: document.querySelector('#game'),
    controller: GameManager
  },
  playerSelect: {
    $element: document.querySelector('#player-select'),
    controller: PlayerSelect,
  }
}

let currentController = null

changeView('playerSelect')


export function changeView(name, data) {
  if (!(name in views)) {
    throw new Error('No such view')
  }

  currentController = new views[name].controller(data)

  showView(name)
}

function showView(name) {
  for (const view in views) {
    views[view].$element.hidden = view !== name
  }
}
