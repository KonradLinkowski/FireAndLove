const X = 'X'
const O = 'O'

const THREE = [...Array(3).keys()]
const NINE = [...Array(9).keys()]

const EVENTS = ['placed', 'won', 'started']

export class OutOfBoundsError extends Error {
  constructor(column, row) {
    super(`The cell is out of bounds column ${column}, row ${row}`)
    this.column = column
    this.row = row
    this.name = this.constructor.name
  }
}

export class IlligalMove extends Error {
  constructor(column, row) {
    super(`The move is already occupied ${column}, row ${row}`)
    this.column = column
    this.row = row
    this.name = this.constructor.name
  }
}

export class Player {
  constructor(name, mark) {
    this.score = 0
    this.name = name
    this.mark = mark
  }
}

export class TicTacToe {
  #cells = THREE.flatMap(row => THREE.map(column => ({ row, column })))
  #columns = THREE.map(i => this.#cells.filter(({ column: c }) => c === i))
  #rows = THREE.map(i => this.#cells.filter(({ row: r }) => r === i))
  #diagonals = [
    this.#cells.filter(({ row, column }) => [0, 4, 8].includes(row * 3 + column)),
    this.#cells.filter(({ row, column }) => [2, 4, 6].includes(row * 3 + column))
  ]
  #listeners = Object.fromEntries(EVENTS.map(event => ([event, []])))

  #currentPlayerIndex = 0

  constructor(players) {
    this.players = [...players]
  }

  restart() {
    this.#cells.forEach(cell => {
      delete cell.mark
    })
    this.#emit('started')
  }

  addEventListener(event, callback) {
    this.#listeners[event].push(callback)
  }

  removeEventListener(event, callback) {
    const index = this.#listeners[event].indexOf(callback)
    this.#listeners[event].splice(index, 1)
  }

  #emit(event, data) {
    this.#listeners[event].forEach(cb => cb(data))
  }

  #nextPlayer() {
    this.#currentPlayerIndex += 1
    if (this.#currentPlayerIndex >= this.players.length) {
      this.#currentPlayerIndex = 0
    }
  }

  #getCell(column, row) {
    if (column < 0 || column > 2 || row < 0 || row > 2) {
      throw new OutOfBoundsError(column, row)
    }
    return this.#cells.find(({ column: c, row: r }) => c === column && r === row)
  }

  getCurrentPlayer() {
    return this.players[this.#currentPlayerIndex]
  }

  getAvailableMoves() {
    return this.#cells.filter(cell => !cell.mark)
  }

  place(column, row) {
    const cell = this.#getCell(column, row)
    if (cell.mark) {
      throw new IlligalMove(column, row)
    }
    const player = this.getCurrentPlayer()
    cell.mark = player.mark
    this.#nextPlayer()
    this.#emit('placed', cell)
    this.#winCheck(player)
    return cell
  }

  #winCheck(player) {
    const subWin = cells =>
      cells[0].mark === player.mark
      && new Set(cells.map(({ mark }) => mark)).size === 1
    
    const possibilities = [this.#rows, this.#columns, this.#diagonals]
    const win = possibilities.some(poss => poss.some(subWin))
    if (win) {
      this.#emit('won', player)
    }
    return win
  }

  valueOf() {
    return this.#rows.map(row => row.map(cell => cell.mark || '  '))
  }

  toString() {
    return this.valueOf().map(row => row.join(' | ')).join('\n---  ---  ---\n')
  }
}
