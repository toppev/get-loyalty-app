const mongoose = require('mongoose')
const { Schema } = mongoose

const rewardSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  // Either products or categories or both
  // e.g tea and coffee or soft drinks
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }],
  categories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }],
  // The campaign that rewarded this reward
  campaign: {
    type: Schema.Types.ObjectId,
    ref: 'Campaign'
  },
  // Value e.g "-20%", "2€", "free"
  itemDiscount: {
    type: String,
    required: true
  },
  // Or/and just points
  customerPoints: {
    type: Schema.Types.Number,
    default: 0
  },
  // The business decides
  // e.g "only if meal", "if more than 10€"
  requirement: {
    type: String,
  },
  expires: {
    type: Date
  },
  // Because rewards are copies of one reward (e.g customer receives a copy of campaign rewards) and id changes,
  // but "recognition" property won't change and we can use it to identify if it's really the same reward even if
  // other properties such as name change or there are duplicates
  recognition: {
    type: Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

module.exports = rewardSchema
