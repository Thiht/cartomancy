import User from '../models/user.model'
import passport from '../passport'
import jwt from 'jsonwebtoken'

import config from '../../config'

function load (req, res, next, id) {
  User.get(id)
    .then(user => {
      req.user = user
      return next()
    })
    .catch(e => next(e))
}

function getUser (req, res) {
  return res.json(req.user)
}

function createUser (req, res, next) {
  passport.authenticate('register', (err, user, info) => {
    if (err) {
      return next(err)
    }

    // FIXME: user can be empty here

    const token = jwt.sign(
      { userID: user._id },
      config.JWT_SECRET,
      { expiresIn: '7 days' }
    )
    return res.json({
      token,
      authenticatedUser: user
    })
  })(req, res, next)
}

export default {
  load,
  getUser,
  createUser
}
