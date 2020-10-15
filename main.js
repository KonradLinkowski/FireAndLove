import { TicTacToe, Player } from './tic-tac-toe.js'

const $board = document.querySelector('.board')
const $cells = [...document.querySelectorAll('.board .cell')]

const players = [
  new Player('Me', ':)'),
  new Player('Computer', ':(')
]

const game = new TicTacToe(players)
game.addEventLestener('placed', ({ row, column, mark }) => {
  const $cell = $cells.find($c => $c.dataset.row == row && $c.dataset.column == column)
  $cell.textContent = mark
})

game.addEventLestener('won', player => {
  setTimeout(() => {
    alert(player.mark + ' win')
    game.restart()
  })
})

game.addEventLestener('started', () => {
  $cells.forEach($c => $c.textContent = '')
})

$board.addEventListener('click', ({ target }) => {
  if (!target.classList.contains('cell')) {
    return
  }

  const { column, row } = target.dataset
  game.place(+column, +row)
})

game.place(0, 0)

