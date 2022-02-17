import Reward from "../rewards/Reward"

export interface Coupon {
  id?: string
  start?: Date
  expiration: {
    min: number
    max: number
  },
  probabilityModifier: number
  reward?: Reward
  status?: "active" | "paused" | "deleted"
  mediaUrls?: string[]
}

