const mongoose = require('mongoose')
const { Schema } = mongoose

const fileSchema = new Schema({
  _id: {
    type: String,
    required: true
  },
  data: {
    type: Buffer,
  },
  contentType: {
    type: String,
  }
})

module.exports = mongoose.model('FileUpload', fileSchema)
