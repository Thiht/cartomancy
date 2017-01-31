import app from '../index'
import httpStatus from 'http-status'
import request from 'supertest'

describe('Board APIs', () =>
  describe('GET /api/boards', () =>
    it('should return an empty list', done => {
      request(app)
        .get('/api/boards')
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.username).to.equal([])
          done()
        })
        .catch(done)
    })
  )
)
