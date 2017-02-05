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
  const { board, wss } = req

  const list = {
    title: req.body.title
  }
  board.lists.push(list)

  board.save()
    .then(savedBoard => {
      wss.broadcast(board._id, savedBoard)
      res.json(savedBoard)
    })
    .catch(e => next(e))
}

function updateList (req, res, next) {
  const { board, wss } = req

  const list = board.lists.id(req.params.listID)
  list.title = req.body.title

  board.save()
    .then(savedBoard => {
      wss.broadcast(board._id, savedBoard)
      res.json(savedBoard)
    })
    .catch(e => next(e))
}

function removeList (req, res, next) {
  const { board, wss } = req

  board.lists.id(req.params.listID).remove()

  board.save()
    .then(savedBoard => {
      wss.broadcast(board._id, savedBoard)
      res.json(savedBoard)
    })
    .catch(e => next(e))
}

function createCard (req, res, next) {
  const { board, wss } = req

  const card = {
    title: req.body.title
  }
  board.lists.id(req.params.listID).cards.push(card)

  board.save()
    .then(savedBoard => {
      wss.broadcast(board._id, savedBoard)
      res.json(savedBoard)
    })
    .catch(e => next(e))
}

function updateCard (req, res, next) {
  const { board, wss } = req
  const { listID, cardID } = req.params
  const { newListID, title, position } = req.body

  const card = board.lists.id(listID).cards.id(cardID)

  // Move the card to another list
  if (typeof newListID !== 'undefined') {
    board.lists.id(listID).cards.id(cardID).remove()
    board.lists.id(newListID).cards.push(card)
  }

  if (typeof title !== 'undefined') {
    card.title = title
  }

  // Move the position of the card in its list
  if (typeof position !== 'undefined') {
    const actualListID = newListID || listID
    board.lists.id(actualListID).cards.id(cardID).remove()
    board.lists.id(actualListID).cards.splice(position, 0, card)
  }

  board.save()
    .then(savedBoard => {
      wss.broadcast(board._id, savedBoard)
      res.json(savedBoard)
    })
    .catch(e => next(e))
}

function removeCard (req, res, next) {
  const { board, wss } = req

  board.lists.id(req.params.listID).cards.id(req.params.cardID).remove()

  board.save()
    .then(savedBoard => {
      wss.broadcast(board._id, savedBoard)
      res.json(savedBoard)
    })
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
