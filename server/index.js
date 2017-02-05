import server from './express'
import debug from './debug'
import config from '../config'

if (!module.parent) {
  server.listen(config.port, () =>
    debug(`server started on port ${config.port} (${config.env})`)
  )
}

export default server
