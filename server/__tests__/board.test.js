import app from '../index'
import httpStatus from 'http-status'
import mongoose from 'mongoose'
import request from 'supertest'

afterEach(() => mongoose.connection.db.dropDatabase())

describe('Board APIs', () => {
  describe('GET /api/boards', () =>
    it('should return an empty list', done =>
      request(app)
        .get('/api/boards')
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).toEqual([])
          done()
        })
        .catch(done.fail)
    )
  )

  describe('POST /api/boards', () =>
    it('should create a new board', done => {
      const board = {
        title: 'Cartomancy Board'
      }
      request(app)
        .post('/api/boards')
        .send(board)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.title).toEqual(board.title)
          done()
        })
        .catch(done.fail)
    })
  )

  describe('PUT /api/boards', () =>
    it('should change the title of an existing board', done => {
      const board = {
        title: 'Cartomancy Board'
      }
      const newTitle = 'Modified Board Title'
      request(app)
        .post('/api/boards')
        .send(board)
        .then(res => {
          const boardID = res.body._id
          request(app)
            .put(`/api/boards/${boardID}`)
            .send({ title: newTitle })
            .expect(httpStatus.OK)
            .then(res => {
              expect(res.body._id).toEqual(boardID)
              expect(res.body.title).toEqual(newTitle)
              done()
            })
            .catch(done.fail)
        })
        .catch(done.fail)
    })
  )
})
