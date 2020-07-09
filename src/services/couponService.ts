import { BASE_URL, get } from "../config/axios";

async function claimCoupon(coupon: string) {
    return get(`${BASE_URL}/coupon/${coupon}`)
}

export {
    claimCoupon
}