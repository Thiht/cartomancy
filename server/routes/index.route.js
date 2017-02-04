import express from 'express'
import boardRoutes from './board.route'

const router = express.Router()

router.get('/health-check', (req, res) => {
  console.log(req.wss.clients)
  req.wss.broadcast('OK')
  res.send('OK')
})

router.use('/boards', boardRoutes)

export default router
