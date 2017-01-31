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
            expect(res.text).to.equal('OK')
            done()
          })
          .catch(done)
      )
  )

  describe('GET /api/404', () =>
    it('should return a 404 error', done => {
      request(app)
        .get('/api/boards')
        .expect(httpStatus.NOT_FOUND)
        .then(res => {
          expect(res.body.message).to.equal('Not Found')
          done()
        })
        .catch(done)
    })
  )
})
