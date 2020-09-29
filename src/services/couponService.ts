import { get } from "../config/axios";

async function claimCoupon(coupon: string) {
    return get(`/coupon/${coupon}`)
}

export {
    claimCoupon
}