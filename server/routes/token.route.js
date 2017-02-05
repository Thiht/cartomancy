import express from 'express'
import validate from 'express-validation'
import paramValidation from '../helpers/param-validation'
import tokenCtrl from '../controllers/token.controller'

const router = express.Router()

router.route('/')
  .post(validate(paramValidation.createToken), tokenCtrl.createToken)

export default router
