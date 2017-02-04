import express from 'express'
import boardRoutes from './board.route'

const router = express.Router()

router.get('/health-check', (req, res) => {
  req.wss.broadcast('health-check', 'OK')
  res.send('OK')
})

router.use('/boards', boardRoutes)

export default router
