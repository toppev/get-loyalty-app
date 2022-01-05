import client from "../config/axios"

async function claimCoupon(coupon: string, referrer?: string | null) {
  if (referrer) {
    return client.post(`/coupon/${coupon}?referrer=${referrer}`)
  }
  return client.post(`/coupon/${coupon}`)
}

export {
  claimCoupon
}
