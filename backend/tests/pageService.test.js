import { closeDatabase, initDatabase } from "./testUtils"
import User from "../src/models/user"
import Coupon from "../src/models/coupon"
import Business from "../src/models/business"
import pageService from "../src/services/pageService"
import Category from "../src/models/category";

beforeAll(async () => {
  await initDatabase('pageService')
})

const DAY_MS = 1000 * 60 * 60 * 24

describe('page context', () => {

  beforeAll(async () => {
    await new Category({ name: 'Category1' }).save()
    await new Coupon({
      status: 'active',
      probabilityModifier: 1,
      reward: {
        name: "Reward1",
        categories: await Category.findOne()
      },
      expiration: { min: DAY_MS * 2, max: DAY_MS * 5 }
    }).save()

    await new User({
      customerData: {
        // Expired coupon
        coupons: [{ coupon: await Coupon.findOne(), expires: Date.now() + 1000 * 60 }]
      }
    }).save()
    await new Business({}).save()
  })

  it('context has populated coupons', async () => {
    const context = await pageService.getPageContext(await User.findOne())
    expect(context.user.availableCoupons.length).toBe(1)
    const [coupon1] = context.user.availableCoupons
    expect(coupon1.coupon.reward.name).toBe("Reward1")
    expect(coupon1.coupon.reward.categories[0].name).toBe("Category1")
  })

})


afterAll(() => {
  closeDatabase()
})
