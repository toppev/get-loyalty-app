import mongoose from "mongoose"
import validator from "validator"

const { Schema } = mongoose
const productSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  categories: [{
    type: mongoose.Types.ObjectId,
    ref: 'Category',
  }],
  images: [{
    type: String,
    validate: {
      validator: function (value, cb) {
        return validator.isURL(value, { protocols: ['http', 'https'] })
      }, message: 'Invalid URL.',
    },
  }],
  price: {
    // Use string so it's possible to include the currency
    type: String
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

export default mongoose.model('Product', productSchema)
