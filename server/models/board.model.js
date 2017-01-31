import mongoose from 'mongoose'
import httpStatus from 'http-status'
import APIError from '../helpers/APIError'

const CardSchema = new mongoose.Schema({
  title: { type: String, required: true }
})

const ListSchema = new mongoose.Schema({
  title: { type: String, required: true },
  cards: [CardSchema]
})

const BoardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  lists: [ListSchema]
}, { timestamps: true })

BoardSchema.statics = {
  get (id) {
    return this.findById(id)
      .select('-__v')
      .exec()
      .then(board => {
        if (board) {
          return board
        }
        const err = new APIError('This board does not exist.', httpStatus.NOT_FOUND)
        return Promise.reject(err)
      })
  },
  getAll () {
    return this.find()
      .select('-__v')
      .select('-lists')
      .exec()
  }
}

export default mongoose.model('Board', BoardSchema)
