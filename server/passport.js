import passport from 'passport'
import Local from 'passport-local'
import Jwt from 'passport-jwt'
import User from './models/user.model'
import httpStatus from 'http-status'
import APIError from './helpers/APIError'

import config from '../config'

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser((id, done) => User.findById(id, done))

const localStrategy = callback => new Local.Strategy({
  passReqToCallback: true
}, callback)

const register = (req, username, password, done) => {
  User
    .findOne({ username })
    .exec()
    .then(user => {
      if (user) {
        const err = new APIError('Already used username', httpStatus.BAD_REQUEST, true)
        return Promise.reject(err)
      }

      const newUser = new User({
        username,
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName
      })
      newUser.password = newUser.generateHash(password)

      return newUser.save()
    })
    .then(user => {
      user.password = undefined
      user.__v = undefined
      done(null, user)
    })
    .catch(err => done(err, false))
}

const login = (req, username, password, done) => {
  User
    .findOne({ username })
    .exec()
    .then(user => {
      if (!user) {
        const err = new APIError('No user found using this e-mail address', httpStatus.BAD_REQUEST, true)
        return Promise.reject(err)
      }

      if (!user.validPassword(password)) {
        const err = new APIError('Wrong password', httpStatus.BAD_REQUEST, true)
        return Promise.reject(err)
      }

      return user
    })
    .then(user => {
      user.password = undefined
      user.__v = undefined
      done(null, user)
    })
    .catch(err => done(err, false))
}

passport.use('register', localStrategy(register))
passport.use('login', localStrategy(login))

const jwtStrategyOptions = {
  secretOrKey: config.JWT_SECRET,
  jwtFromRequest: Jwt.ExtractJwt.fromAuthHeader()
}

passport.use(new Jwt.Strategy(jwtStrategyOptions, (payload, done) => {
  User
    .findById(payload.userID)
    .exec()
    .then(user => {
      if (!user) {
        const err = new APIError('User not found', httpStatus.BAD_REQUEST, true)
        return Promise.reject(err)
      }
      done(null, user)
    })
    .catch(err => done(err, false))
}))

export default passport
