import Coupon, { CouponDocument, ICoupon } from "../models/coupon"
import Business from "../models/business"
import StatusError from "../util/statusError"
import { IReward } from "../models/reward"
import { UserDocument } from "../models/user"
import logger from "../util/logger"
import { format } from "../util/stringUtils"
import pollingService from "./pollingService"

export default {
  getAllCoupons,
  create,
  update,
  deleteCoupon,
  getAllRewards,
  checkRefreshCoupons,
  useCoupon
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

async function checkRefreshCoupons(user: UserDocument) {
  logger.debug(`Checking ${user.id} coupons...`)
  user.customerData.coupons = (user.customerData.coupons || []).filter(it => {
    if (it.expires && new Date(it.expires).getTime() < Date.now()) {
      logger.debug(`Removed expires coupon from user ${user.id}: ${it?.coupon?.reward?.name}`)
      return false
    }
    return true
  })

  const currentCoupons = user.customerData.coupons
  const maxNewCoupons = 5 - currentCoupons.length // make configurable later

  if (maxNewCoupons <= 0) {
    logger.debug(`User ${user.id} has max coupons already`)
  } else {

    const hasCoupon = (coupon: CouponDocument) => {
      if (currentCoupons.some(it => it.coupon._id == coupon._id)) {
        logger.debug(`User ${user.id} already has coupon ${coupon._id}`)
        return true
      }
      return false
    }

    const available = await Coupon.find({ status: 'active' })
    const newCoupons: { coupon: ICoupon, expires: Date }[] = []

    available.filter(it => it.reward)
      .forEach((coupon: CouponDocument) => {
        if (newCoupons.length < maxNewCoupons && !hasCoupon(coupon)) {
          if (coupon.probabilityModifier > Math.random()) {
            const DAY_MS = 1000 * 60 * 60 * 24
            const min = Math.floor(coupon.expiration.min / DAY_MS)
            const max = Math.ceil(coupon.expiration.max / DAY_MS)
            const days = Math.floor(Math.random() * (max - min + 1)) + min
            const expires = new Date((Date.now() + days * DAY_MS))
            logger.info(`User ${user.id} won a new coupon ${coupon?.reward?.name} for ${days} (expires ${expires}`)
            newCoupons.push({ coupon, expires })
          } else {
            logger.debug(`User ${user.id} did not win coupon ${coupon?.reward?.name}`)
          }
        }
      })

    logger.debug({ currentCoupons, newCoupons })

    user.customerData.coupons = [...currentCoupons, ...newCoupons]
  }

  return user.save()
}

async function useCoupon(user: UserDocument, couponId: any) {
  const userCoupons = user.customerData.coupons
  const coupon = userCoupons.find(it => it.coupon._id == couponId)
  if (!coupon) {
    throw new StatusError("Coupon not found", 404)
  }
  if (new Date(coupon.expires).getTime() < Date.now()) {
    throw new StatusError(`Coupon has expired ${coupon.expires}`, 401)
  }

  // Revoke the coupon
  user.customerData.coupons = userCoupons.filter(it => it.coupon._id != couponId)

  // Send notification message
  const business = await Business.findOne()
  const translations = business.config.translations
  const couponNames = [coupon].map(it => it?.coupon?.reward?.name || "").join(', ')
  const message = format(couponNames.length === 1 ? translations.couponUsed.singular : translations.couponUsed.plural, [couponNames])
  pollingService.sendToUser(user.id, { message: message, refresh: true }, pollingService.IDENTIFIERS.REWARD_USE)

  await user.save()
}
