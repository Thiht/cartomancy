import passport from '../passport'
import jwt from 'jsonwebtoken'

import config from '../../config'

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
    return res.json({ token })
  })(req, res, next)
}

export default {
  createUser
}
