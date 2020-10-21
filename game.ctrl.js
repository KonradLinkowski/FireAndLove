import { TicTacToe } from './tic-tac-toe.js'

export class GameManager {
  #$board = document.querySelector('.board')
  #$cells = [...document.querySelectorAll('.board .cell')]
  #game = null

  constructor(players) {
    this.#game = new TicTacToe(players)
    this.#$board.addEventListener('click', this.#handleBoardClick.bind(this))

    this.#game.addEventListener('placed', this.#handleMarkPlace.bind(this))
    this.#game.addEventListener('won', this.#handleWin.bind(this))
    this.#game.addEventListener('started', this.#handleStart.bind(this))
  }

  #handleStart() {
    this.#$cells.forEach($c => $c.textContent = '')
  }

  #handleWin(player) {
    setTimeout(() => {
      alert(player.mark + ' win')
      game.restart()
    })
  }

  #handleMarkPlace({ row, column, mark }) {
    const $cell = this.#$cells.find($c => $c.dataset.row == row && $c.dataset.column == column)
    $cell.textContent = mark
  }

  #handleBoardClick({ target }) {
    if (!target.classList.contains('cell')) {
      return
    }
  
    const { column, row } = target.dataset
    this.#game.place(+column, +row)
  }
}
