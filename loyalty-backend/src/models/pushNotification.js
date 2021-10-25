import mongoose from "mongoose"

const { Schema } = mongoose

const notificationSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: false
  },
  sent: {
    type: Date,
    default: Date.now
  },
  // How many users will/should receive the notification
  receivers: {
    type: Number,
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

export default mongoose.model('PushNotification', notificationSchema)
