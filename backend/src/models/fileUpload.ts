import mongoose from "mongoose"

const { Schema } = mongoose

interface FileUpload {
  id: any
  _id: any
  data: Buffer
  visibility: 'public' | 'private'
}

interface FileUploadDocument extends FileUpload, Document {
}

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

export default mongoose.model<FileUploadDocument>('FileUpload', fileSchema)
