import { closeDatabase, initDatabase } from "./testUtils"
import User, { UserDocument } from "../src/models/user"
import businessService from "../src/services/businessService"
import couponService from "../src/services/couponService"
import Coupon, { ICoupon } from "../src/models/coupon"
import { IReward } from "../src/models/reward"
import StatusError from "../src/util/statusError"

beforeAll(async () => {
  await initDatabase('ccouponService')
})

const DAY_MS = 1000 * 60 * 60 * 24

// @ts-ignore
const newReward = (name: string): IReward => ({ name })

describe('coupon refresh', () => {

  let user: UserDocument

  beforeAll(async () => {
    const coupons: ICoupon[] = [{
      status: 'active',
      id: undefined,
      probabilityModifier: 1,
      reward: newReward("Reward1"),
      expiration: { min: DAY_MS * 2, max: DAY_MS * 5 }
    }, {
      status: 'active',
      id: undefined,
      probabilityModifier: 0,
      reward: newReward("Reward2"),
      expiration: { min: DAY_MS * 5, max: DAY_MS * 10 }
    }]
    await Promise.all(coupons.map(it => new Coupon(it).save()))

    const userId = (await new User({
      customerData: {
        // Expired coupon
        coupons: [{ coupon: await Coupon.findOne(), expires: Date.now() - 10_000 }]
      }
    }).save())._id
    user = await User.findById(userId)
  })

  it('updates correctly', async () => {
    await couponService.checkRefreshCoupons(user)
    const u = await User.findById(user.id)
    const { coupons } = u.customerData

    expect(coupons.length).toBe(1)

    const [coupon1] = coupons
    expect(coupon1.coupon).toBeDefined()
    expect(new Date(coupon1.expires).getTime()).toBeGreaterThan(Date.now() + DAY_MS)
    expect(new Date(coupon1.expires).getTime()).toBeLessThanOrEqual(Date.now() + DAY_MS * 5)


    // Cannot receive multiple of same
    expect(coupons.length).toBe(1)
    const newUser = await couponService.checkRefreshCoupons(user)
    expect(newUser.customerData.coupons.length).toBe(1)

  })

})

describe('coupon use', () => {

  let user
  let coupon

  beforeAll(async () => {
    coupon = await new Coupon({
      status: 'active',
      id: undefined,
      probabilityModifier: 1,
      reward: newReward("Reward123"),
      expiration: { min: DAY_MS * 2, max: DAY_MS * 5 }
    }).save()

    const userId = (await new User({
      customerData: {
        coupons: [{
          coupon: coupon.id,
          expires: Date.now() + DAY_MS
        }]
      }
    }).save())._id
    user = await User.findById(userId)

    await businessService.createBusiness({}, user.id)
  })

  it('has coupon', async () => {
    expect(user.customerData.coupons.length).toBe(1)
  })

  it('uses coupon', async () => {
    await couponService.useCoupon(user, coupon.id)
    const u = await User.findById(user.id)
    const { coupons } = u.customerData
    expect(coupons.length).toBe(0) // the coupon is removed
  })

  it('cannot use if does not have coupons', async () => {
    user.customerData.coupons = []
    await user.save()
    await expect(couponService.useCoupon(user, coupon.id)).rejects.toThrow(StatusError)
  })

  it('cannot use expired coupon', async () => {
    const expired = Date.now() - 1000 * 60 * 60 * 12
    const coupon = await Coupon.findOne()
    user.customerData.coupons = [{
      coupon: coupon,
      expires: expired
    }]
    await user.save()
    try {
      await couponService.useCoupon(user, coupon.id)
      expect(true).toBe(false) // i.e., must fail before
    } catch (err) {
      expect(err.message).toMatch(new RegExp(`^Coupon has expired?`))
    }
  })

})


afterAll(() => {
  closeDatabase()
})
