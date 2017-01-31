import express from 'express'
import boardRoutes from './board.route'

const router = express.Router()

router.get('/health-check', (req, res) => res.send('OK'))

router.use('/boards', boardRoutes)

export default router
