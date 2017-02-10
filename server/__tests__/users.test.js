import server from '../index'
import httpStatus from 'http-status'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import pick from 'lodash.pick'
import request from 'supertest'

afterEach(() => mongoose.connection.db.dropDatabase())

describe('Users API', () => {
  describe('POST /api/users', () => {
    it('should create a new user without a first name or a last name', done => {
      const user = {
        username: 'Username',
        email: 'username@example.org',
        password: '3!LBy}7AjI'
      }
      createUser(user)
        .expect(httpStatus.OK)
        .then(res => {
          const { authenticatedUser, token } = res.body
          expect(authenticatedUser.username).toEqual(user.username)
          expect(authenticatedUser.email).toEqual(user.email)
          expect(authenticatedUser.password).toBeUndefined()
          expect(jwt.decode(token).userID).toEqual(authenticatedUser._id)
          done()
        })
        .catch(done.fail)
    })

    it('should create a new user with a first name and a last name', done => {
      const user = {
        username: 'Username',
        email: 'username@example.org',
        password: '3!LBy}7AjI',
        firstName: 'John',
        lastName: 'Doe'
      }
      createUser(user)
        .expect(httpStatus.OK)
        .then(res => {
          const { authenticatedUser, token } = res.body
          expect(authenticatedUser.username).toEqual(user.username)
          expect(authenticatedUser.email).toEqual(user.email)
          expect(authenticatedUser.firstName).toEqual(user.firstName)
          expect(authenticatedUser.lastName).toEqual(user.lastName)
          expect(authenticatedUser.password).toBeUndefined()
          expect(jwt.decode(token).userID).toEqual(authenticatedUser._id)
          done()
        })
        .catch(done.fail)
    })

    it('should not create a new user with a weak password', done => {
      const user = {
        username: 'Username',
        email: 'username@example.org',
        password: 'abc'
      }
      createUser(user)
        .expect(httpStatus.BAD_REQUEST)
        .then(() => done())
        .catch(done.fail)
    })

    it('should not create a new user with an invalid email address', done => {
      const user = {
        username: 'Username',
        email: 'email',
        password: '3!LBy}7AjI'
      }
      createUser(user)
        .expect(httpStatus.BAD_REQUEST)
        .then(() => done())
        .catch(done.fail)
    })

    it('should not create a new user without an email address', done => {
      const user = {
        username: 'Username',
        password: '3!LBy}7AjI'
      }
      createUser(user)
        .expect(httpStatus.BAD_REQUEST)
        .then(() => done())
        .catch(done.fail)
    })

    it('should not create a new user without a password', done => {
      const user = {
        username: 'Username',
        email: 'username@example.org'
      }
      createUser(user)
        .expect(httpStatus.BAD_REQUEST)
        .then(() => done())
        .catch(done.fail)
    })

    it('should not create a new user with an empty username', done => {
      const user = {
        username: '',
        email: 'username@example.org',
        password: '3!LBy}7AjI',
        firstName: 'John',
        lastName: 'Doe'
      }
      createUser(user)
        .expect(httpStatus.BAD_REQUEST)
        .then(() => done())
        .catch(done.fail)
    })

    it('should not create a new user with a blank username', done => {
      const user = {
        username: '  \t  ', // two spaces, a tab, two spaces
        email: 'username@example.org',
        password: '3!LBy}7AjI',
        firstName: 'John',
        lastName: 'Doe'
      }
      createUser(user)
        .expect(httpStatus.BAD_REQUEST)
        .then(() => done())
        .catch(done.fail)
    })

    it('should not create a new user with an already registered username', done => {
      const user1 = {
        username: 'Username',
        email: 'username@example.org',
        password: '3!LBy}7AjI'
      }
      const user2 = {
        username: user1.username,
        email: 'ponyland@example.com',
        password: '>14JlCm?ZG'
      }
      createUser(user1)
        .expect(httpStatus.OK)
        .then(() => {
          return createUser(user2)
            .expect(httpStatus.BAD_REQUEST)
        })
        .then(() => done())
        .catch(done.fail)
    })
  })
})

function createUser (user) {
  user = pick(user, ['username', 'email', 'password', 'firstName', 'lastName'])
  return request(server)
    .post('/api/users')
    .send(user)
}
