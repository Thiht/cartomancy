import mongoose from '../mongoose'
import bcrypt from 'bcrypt-nodejs'
import httpStatus from 'http-status'
import APIError from '../helpers/APIError'

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String }
})

UserSchema.statics = {
  get (id) {
    return this.findById(id)
      .select('-__v')
      .select('-password')
      .exec()
      .then(user => {
        if (user) {
          return user
        }
        const err = new APIError('This user does not exist.', httpStatus.NOT_FOUND)
        return Promise.reject(err)
      })
  }
}

UserSchema.methods.generateHash = password =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)

UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}

export default mongoose.model('User', UserSchema)
