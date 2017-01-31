import app from '../index'
import httpStatus from 'http-status'
import request from 'supertest'

describe('Miscellaneous API', () => {
  describe('GET /api/health-check', () =>
    it('should return OK', done =>
      request(app)
        .get('/api/health-check')
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.text).toEqual('OK')
          done()
        })
        .catch(done.fail)
    )
  )

  describe('GET /api/404', () =>
    it('should return a 404 error', done =>
      request(app)
        .get('/api/404')
        .expect(httpStatus.NOT_FOUND)
        .then(res => {
          expect(res.body.message).toEqual('Not Found')
          done()
        })
        .catch(done.fail)
    )
  )

  describe('Error Handling', () =>
    it('should handle an invalid ObjectId', done =>
      request(app)
        .get('/api/boards/1234567890')
        .expect(httpStatus.INTERNAL_SERVER_ERROR)
        .then(res => {
          expect(res.body.message).toEqual('Internal Server Error')
          done()
        })
        .catch(done.fail)
    )
  )
})
