import Reward from "../rewards/Reward"

export interface Coupon {
  id?: string
  start?: Date
  expirationMillis?: number
  reward?: Reward
  status?: "active" | "deleted"
}

