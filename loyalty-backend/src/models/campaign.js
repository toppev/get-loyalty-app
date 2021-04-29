const mongoose = require('mongoose')
const rewardSchema = require('./reward')
const campaignTypes = require('@toppev/getloyalty-campaigns')
const { Schema } = mongoose


const requirementSchema = new Schema({
  type: {
    type: String,
    enum: Object.keys(campaignTypes)
  },
  values: [{
    type: String
  }],
  question: {
    type: String,
    default: function () {
      let campaignType = campaignTypes[this.type]
      return campaignType ? campaignType.question : null
    }
  }
})

const campaignSchema = new Schema({
  start: {
    type: Date,
    default: Date.now
  },
  end: {
    type: Date
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }],
  categories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }],
  requirements: [requirementSchema],
  // The code that will give the reward
  // Should be unique
  couponCode: {
    type: String
  },
  // Count total rewards here
  rewardedCount: {
    type: Number,
    default: 0
  },
  maxRewards: {
    // maximum number of rewards
    total: {
      type: Number,
    },
    // per user limit
    user: {
      type: Number,
      default: 1
    },
  },
  // Reward for each purchase (or whatever transaction)
  transactionPoints: {
    type: Schema.Types.Number,
    default: 0
  },
  endReward: [rewardSchema],
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

campaignSchema.pre('save', async function (next) {
  if (this.isModified('couponCode') && this.couponCode) {
    this.couponCode = this.couponCode.toLowerCase()
  }
  next()
})

campaignSchema.methods.getCurrentStamps = function (customerData) {
  const duringCampaign = (date) => date > this.start && (!this.end || date < this.end)
  return customerData.purchases.filter(purchase => duringCampaign(new Date(purchase.createdAt)))
}

campaignSchema.virtual("totalStampsNeeded").get(function () {
  const req = this.requirements.find(it => it.type === 'stamps')
  if (!req || !req.values.length) return 0
  return parseInt(req.values[0], 10)
})

module.exports = mongoose.model('Campaign', campaignSchema)
