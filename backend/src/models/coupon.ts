import mongoose from "mongoose"
import rewardSchema, { IReward } from "./reward"

const { Schema } = mongoose

export interface ICoupon {
  _id?: any
  id?: any
  start?: Date
  expiration: {
    min: number
    max: number
  },
  probabilityModifier: number
  reward?: IReward
  status?: "active" | "deleted"
  mediaUrls?: string[]
}

export interface CouponDocument extends ICoupon, Document {
}

const couponSchema = new Schema<CouponDocument>({
  start: {
    type: Date,
    default: Date.now
  },
  expiration: {
    min: {
      type: Number,
      default: 1000 * 60 * 60 * 24 // 24h
    },
    max: {
      type: Number,
      default: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
  },
  probabilityModifier: {
    type: Number,
    default: 0.2
  },
  status: {
    type: String,
    enum: ["active", "paused", "deleted", undefined],
    default: "active",
  },
  mediaUrls: {
    type: [String],
  },
  reward: rewardSchema,
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

export default mongoose.model<CouponDocument>('Coupon', couponSchema)
