import express from 'express'
import validate from 'express-validation'
import paramValidation from '../helpers/param-validation'
import boardCtrl from '../controllers/board.controller'

const router = express.Router()

router.route('/')
  .get(boardCtrl.getAllBoards)
  .post(validate(paramValidation.createBoard), boardCtrl.createBoard)

router.route('/:boardID')
  .get(boardCtrl.getBoard)
  .put(validate(paramValidation.updateBoard), boardCtrl.updateBoard)
  .delete(boardCtrl.removeBoard)

router.route('/:boardID/lists')
  .post(validate(paramValidation.createList), boardCtrl.createList)

router.route('/:boardID/lists/:listID')
  .put(validate(paramValidation.updateList), boardCtrl.updateList)
  .delete(boardCtrl.removeList)

router.route('/:boardID/lists/:listID/cards')
  .post(validate(paramValidation.createCard), boardCtrl.createCard)

router.route('/:boardID/lists/:listID/cards/:cardID')
  .put(validate(paramValidation.updateCard), boardCtrl.updateCard)
  .delete(boardCtrl.removeCard)

router.param('boardID', boardCtrl.load)

export default router
