import mongoose from '../mongoose'
import bcrypt from 'bcrypt-nodejs'

const UserSchema = new mongoose.Schema({
  local: {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
  }
})

UserSchema.methods.generateHash = password =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)

UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.local.password)
}

export default mongoose.model('User', UserSchema)
