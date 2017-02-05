import express from 'express'
import expressValidation from 'express-validation'
import expressWinston from 'express-winston'
import http from 'http'
import httpStatus from 'http-status'
import logger from 'morgan'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import methodOverride from 'method-override'
import helmet from 'helmet'
import cors from 'cors'

import APIError from './helpers/APIError'
import passport from './passport'
import routes from './routes/index.route'
import websocket from './websocket'
import winstonInstance from './winston'

import config from '../config'

const app = express()
const server = http.createServer(app)

if (config.env === 'development') {
  app.use(logger('dev'))
}

// Instantiate WebSocket
app.use(websocket({
  server,
  path: '/ws'
}))

// Parse body params and attach them to req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cookieParser())
app.use(compress())
app.use(methodOverride())
app.use(helmet())
app.use(cors())

app.use(passport.initialize())

if (config.env === 'development') {
  expressWinston.requestWhitelist.push('body')
  expressWinston.responseWhitelist.push('body')
  app.use(expressWinston.logger({
    winstonInstance,
    meta: true,
    msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
    colorStatus: true
  }))
}

app.use('/api', routes)

app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ')
    const error = new APIError(unifiedErrorMessage, err.status, true)
    return next(error)
  } else if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status, err.isPublic)
    return next(apiError)
  }
  return next(err)
})

app.use((req, res, next) => {
  const err = new APIError('API not found', httpStatus.NOT_FOUND)
  return next(err)
})

if (config.env !== 'test') {
  app.use(expressWinston.errorLogger({
    winstonInstance
  }))
}

app.use((err, req, res, next) =>
  res.status(err.status).json({
    message: err.isPublic ? err.message : httpStatus[err.status],
    stack: config.env === 'development' ? err.stack : {}
  })
)

export default server
