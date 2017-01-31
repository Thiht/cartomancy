import app from '../index'
import httpStatus from 'http-status'
import mongoose from 'mongoose'
import request from 'supertest'

afterAll(done => {
  mongoose.models = {}
  mongoose.modelSchemas = {}
  mongoose.connection.db.dropDatabase()
  mongoose.connection.close()
  done()
})

const board = {
  title: 'Cartomancy Board'
}

describe('Board APIs', () => {
  describe('GET /api/boards', () =>
    it('should return an empty list', done => {
      request(app)
        .get('/api/boards')
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).toEqual([])
          done()
        })
        .catch(done.fail)
    })
  )

  describe('POST /api/boards', () =>
    it('should create a new board', done => {
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
})
