import mongoose from "mongoose"

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
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  }
})

export default mongoose.model('FileUpload', fileSchema)
