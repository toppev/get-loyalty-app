import { get } from "../config/axios";

async function claimCoupon(coupon: string, referrer?: string | null) {
    if (referrer) {
        return get(`/coupon/${coupon}?referrer=${referrer}`)
    }
    return get(`/coupon/${coupon}`)
}

export {
    claimCoupon
}
