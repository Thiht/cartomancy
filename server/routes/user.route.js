import express from 'express'
import validate from 'express-validation'
import paramValidation from '../helpers/param-validation'
import userCtrl from '../controllers/user.controller'

const router = express.Router()

router.route('/')
  .post(validate(paramValidation.createUser), userCtrl.createUser)

export default router
