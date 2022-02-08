import { Document, Schema, Types as MongooseTypes } from "mongoose"

export interface IReward {
  name: string
  description: string
  products: Schema.Types.ObjectId[]
  categories: Schema.Types.ObjectId[]
  // The campaign that rewarded this reward
  campaign: Schema.Types.ObjectId
  // Value e.g "-20%", "2€", "free"
  itemDiscount: string|undefined
  // Or/and just points
  customerPoints: number
  // The business decides
  // e.g "only if meal", "if more than 10€"
  requirement: string
  expires: Date
  // Because rewards are copies of one reward (e.g customer receives a copy of campaign rewards) and id changes,
  // but "recognition" property won't change and we can use it to identify if it's really the same reward even if
  // other properties such as name change or there are duplicates
  recognition: Schema.Types.ObjectId
}

export interface RewardDocument extends IReward, Document {
}


const rewardSchema = new Schema<RewardDocument>({
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
    type: MongooseTypes.ObjectId,
    default: MongooseTypes.ObjectId
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

export default rewardSchema
