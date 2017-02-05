const env = process.env.NODE_ENV || 'development'
const config = require(`./${env}`)
config.env = env

if (config.JWT_SECRET.trim() === '') {
  throw new Error('JWT_SECRET must NOT be empty')
}

export default config
