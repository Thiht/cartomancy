const env = process.env.NODE_ENV || 'development'
const config = require(`./${env}`)
config.env = env

export default config
