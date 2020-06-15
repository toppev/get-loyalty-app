import { getBusinessUrl, post } from "../config/axios";

async function claimCoupon(coupon: string) {
    return post(`${getBusinessUrl()}/coupon/${coupon}`, {})
}

export {
    claimCoupon
}