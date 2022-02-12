import { get, patch, post, remove } from "../config/axios"
import { Coupon } from "../components/coupons/Coupon"

function listCoupons() {
  return get(`/coupon/list`)
}

function createCoupon(coupon: Coupon) {
  return post(`/coupon`, coupon)
}

function updateCoupon(coupon: Coupon) {
  return patch(`/coupon/${coupon?.id}`, coupon)
}

function deleteCoupon(coupon: Coupon) {
  return remove(`/coupon/${coupon?.id}`)
}

export {
  listCoupons,
  updateCoupon,
  createCoupon,
  deleteCoupon,
}
