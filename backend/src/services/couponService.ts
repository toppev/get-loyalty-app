import Coupon, { CouponDocument } from "../models/coupon"
import Business from "../models/business"
import StatusError from "../util/statusError"
import { IReward } from "../models/reward"
import { IUser } from "../models/user";

export default {
  getAllCoupons,
  create,
  update,
  deleteCoupon,
  getAllRewards,
}

async function getAllCoupons(): Promise<CouponDocument[]> {
  return Coupon.find({ status: { $ne: "deleted" } })
    .populate('products categories endReward.categories endReward.products')
}

/**
 * Get all rewards from the business's coupons
 */
async function getAllRewards(): Promise<IReward[]> {
  const rewards = await Coupon.find({})
    .populate('endReward.categories endReward.products')
    .select('endReward')
  // @ts-ignore
  return [].concat(...rewards.map(it => it.endReward))
}

/**
 * Create a new coupon. The business is automatically assigned to the coupon.
 * @param {Object} coupon the coupon to create
 * @return the coupon
 */
async function create(coupon) {
  const business = await Business.findOne()
  const limit = business.plan.limits.couponsTotal
  if (limit > 0 && (await getAllCoupons()).length >= limit) {
    throw new StatusError('Plan limit reached', 402)
  }
  return Coupon.create(coupon)
}

/**
 * Update an existing coupon. Returns the updated product
 * @param couponId the coupon's _id value
 * @param {Object} updatedCoupon the object with the values to update
 */
async function update(couponId, updatedCoupon) {
  const coupon = await Coupon.findById(couponId)
  if (!coupon) throw new StatusError(`Cannot find coupon ${couponId}`, 404)
  Object.assign(coupon, updatedCoupon)
  return coupon.save()
}

/**
 * Delete an existing coupon from the database
 * @param couponId the coupon's _id value
 */
async function deleteCoupon(couponId) {
  return await Coupon.findByIdAndUpdate(couponId, { status: "deleted" })
}

async function refreshCoupons(user: IUser) {
  const available = await Coupon.find({ status: 'active' })
  // TODO
}
