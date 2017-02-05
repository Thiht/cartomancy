import express from 'express'
import boardRoutes from './board.route'
import tokenRoutes from './token.route'
import userRoutes from './user.route'

const router = express.Router()

router.get('/health-check', (req, res) => {
  req.wss.broadcast('health-check', 'OK')
  res.send('OK')
})

router.use('/boards', boardRoutes)
router.use('/tokens', tokenRoutes)
router.use('/users', userRoutes)

export default router
