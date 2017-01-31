import app from '../index'
import httpStatus from 'http-status'
import request from 'supertest'

describe('API', () => {
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
    it('should return a 404 error', done => {
      request(app)
        .get('/api/404')
        .expect(httpStatus.NOT_FOUND)
        .then(res => {
          console.log(res)
          expect(res.body.message).toEqual('Not Found')
          done()
        })
        .catch(done.fail)
    })
  )
})
