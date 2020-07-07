import { getBusinessUrl, get } from "../config/axios";

async function claimCoupon(coupon: string) {
    return get(`${getBusinessUrl()}/coupon/${coupon}`)
}

export {
    claimCoupon
}