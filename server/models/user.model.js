import mongoose from '../mongoose'
import bcrypt from 'bcrypt-nodejs'

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String }
})

UserSchema.methods.generateHash = password =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)

UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}

export default mongoose.model('User', UserSchema)
