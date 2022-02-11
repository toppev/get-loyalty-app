import mongoose from "mongoose"
import rewardSchema, { IReward } from "./reward"

const { Schema } = mongoose

export interface ICoupon {
  start?: Date
  expirationMillis?: number
  reward?: IReward
  status?: "active" | "deleted"
}

export interface CouponDocument extends ICoupon, Document {
}

const campaignSchema = new Schema<CouponDocument>({
  start: {
    type: Date,
    default: Date.now
  },
  expirationMillis: {
    type: Number,
    default: 1000 * 60 * 60 * 24 // 24h
  },
  status: {
    type: String,
    enum: ["active", "deleted", undefined]
  },
  reward: rewardSchema,
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

export default mongoose.model<CouponDocument>('Coupon', campaignSchema)
