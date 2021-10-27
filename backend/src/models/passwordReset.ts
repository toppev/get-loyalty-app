import { Document, model, Model, Schema } from "mongoose"

export interface IPasswordReset {
  token: string,
  userId: Schema.Types.ObjectId,
  createdAt: Date
  updatedAt: Date
  usedAt: Date
}

interface PasswordResetDocument extends IPasswordReset, Document {
}

export interface PasswordResetModel extends Model<PasswordResetDocument> {
  findByToken(token: string): Promise<PasswordResetDocument | undefined>
}

const resetModel = new Schema<PasswordResetDocument, PasswordResetModel>({
  token: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  usedAt: {
    type: Date,
    default: undefined
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

resetModel.statics.findByToken = function (token, callback) {
  return this.findOne({ token }, callback)
}

export default model<PasswordResetDocument, PasswordResetModel>('PasswordReset', resetModel)
