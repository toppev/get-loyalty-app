import client from "../config/axios"

async function claimCoupon(coupon: string, referrer?: string | null) {
  if (referrer) {
    return client.get(`/coupon/${coupon}?referrer=${referrer}`)
  }
  return client.get(`/coupon/${coupon}`)
}

export {
  claimCoupon
}
