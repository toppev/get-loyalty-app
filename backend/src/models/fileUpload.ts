import mongoose from "mongoose"

const { Schema } = mongoose

export interface IFileUpload {
  id: any
  _id: any
  data: Buffer | undefined
  /** I.e., a link to the resource */
  externalSource: string | undefined
  visibility: 'public' | 'private'
}

interface FileUploadDocument extends IFileUpload, Document {
}

const fileSchema = new Schema({
  _id: {
    type: String,
    required: true
  },
  data: {
    type: Buffer,
  },
  externalSource: {
    type: String
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
