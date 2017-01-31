import Board from '../models/board.model'

function load (req, res, next, id) {
  Board.get(id)
    .then(board => {
      req.board = board
      return next()
    })
    .catch(e => next(e))
}

function getBoard (req, res) {
  return res.json(req.board)
}

function getAllBoards (req, res, next) {
  Board.getAll()
    .then(boards => res.json(boards))
    .catch(e => next(e))
}

function createBoard (req, res, next) {
  const board = new Board({
    title: req.body.title
  })

  board.save()
    .then(savedBoard => res.json(savedBoard))
    .catch(e => next(e))
}

function updateBoard (req, res, next) {
  const board = req.board
  board.title = req.body.title

  board.save()
    .then(savedBoard => res.json(savedBoard))
    .catch(e => next(e))
}

function removeBoard (req, res, next) {
  const board = req.board
  board.remove()
    .then(deletedBoard => res.json(deletedBoard))
    .catch(e => next(e))
}

function createList (req, res, next) {
  const board = req.board

  const list = {
    title: req.body.title
  }
  board.lists.push(list)

  board.save()
    .then(savedBoard => res.json(savedBoard))
    .catch(e => next(e))
}

function updateList (req, res, next) {
  const board = req.board

  const list = board.lists.id(req.params.listID)
  list.title = req.body.title

  board.save()
    .then(savedBoard => res.json(savedBoard))
    .catch(e => next(e))
}

function removeList (req, res, next) {
  const board = req.board

  board.lists.id(req.params.listID).remove()

  board.save()
    .then(savedBoard => res.json(savedBoard))
    .catch(e => next(e))
}

function createCard (req, res, next) {
  const board = req.board

  const card = {
    title: req.body.title
  }
  board.lists.id(req.params.listID).cards.push(card)

  board.save()
    .then(savedBoard => res.json(savedBoard))
    .catch(e => next(e))
}

function updateCard (req, res, next) {
  const board = req.board

  const card = board.lists.id(req.params.listID).cards.id(req.params.cardID)
  card.title = req.body.title

  board.save()
    .then(savedBoard => res.json(savedBoard))
    .catch(e => next(e))
}

function removeCard (req, res, next) {
  const board = req.board

  board.lists.id(req.params.listID).cards.id(req.params.cardID).remove()

  board.save()
    .then(savedBoard => res.json(savedBoard))
    .catch(e => next(e))
}

export default {
  load,
  getBoard,
  getAllBoards,
  createBoard,
  updateBoard,
  removeBoard,
  createList,
  updateList,
  removeList,
  createCard,
  updateCard,
  removeCard
}
