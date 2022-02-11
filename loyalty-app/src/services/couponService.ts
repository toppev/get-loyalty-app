import client from "../config/axios"

async function claimCoupon(coupon: string, referrer?: string | null) {
  if (referrer) {
    return client.post(`/campaign/coupon/${coupon}?referrer=${referrer}`)
  }
  return client.post(`/campaign/coupon/${coupon}`)
}

export {
  claimCoupon
}
