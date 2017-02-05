import passport from 'passport'
import Local from 'passport-local'
import Jwt from 'passport-jwt'
import User from './models/user.model'

import config from '../config'

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser((id, done) => User.findById(id, done))

const localStrategy = callback => new Local.Strategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, callback)

const register = (req, email, password, done) => {
  User
    .findOne({ 'local.email': email })
    .exec()
    .then(user => {
      if (user) {
        throw new Error('Already used e-mail address')
      }

      const newUser = new User()
      newUser.local = {
        username: req.body.username,
        email,
        password: newUser.generateHash(password)
      }

      return newUser.save()
    })
    .then(user => {
      user.local.password = undefined
      done(null, user)
    })
    .catch(err => done(err, false))
}

const login = (req, email, password, done) => {
  User
    .findOne({ 'local.email': email })
    .exec()
    .then(user => {
      if (!user) {
        throw new Error('No user found using this e-mail address')
      }

      if (!user.validPassword(password)) {
        throw new Error('Wrong password')
      }

      return user
    })
    .then(user => {
      user.local.password = undefined
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
        throw new Error('User not found')
      }
      done(null, user)
    })
    .catch(err => done(err, false))
}))

export default passport
