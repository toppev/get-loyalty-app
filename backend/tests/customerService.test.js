import defaultCustomerLevels from "../src/config/defaultLevels"
import { closeDatabase, initDatabase, sleep } from "./testUtils"

import User from "../src/models/user"
import Business from "../src/models/business"
import customerService from "../src/services/customerService"

beforeAll(async () => {
  await initDatabase('customerService')
})

describe('customer level', () => {

  it('updates correctly', async () => {
    const reward1 = { name: 'level test reward', itemDiscount: 'free' }
    const reward2 = { name: 'second level test reward', itemDiscount: 'free' }
    const level1 = {
      name: 'base level',
      requiredPoints: 0,
      rewards: [reward1]
    }
    const level2 = {
      name: 'second level',
      requiredPoints: 1,
      rewards: [reward2]
    }
    const business = await new Business({
      public: {
        customerLevels: [level1, level2]
      }
    }).save()

    const user = await new User({}).save()
    let res = await customerService.updateCustomerLevel(user, business)
    expect(res.points).toEqual(0)
    expect(res.currentLevel.name).toEqual(level1.name)
    expect(res.newRewards.length).toEqual(1)
    expect(res.newRewards[0].name).toEqual(reward1.name)

    await customerService.updateCustomerProperties(user.id, { points: 1 })
    res = await customerService.updateCustomerLevel(await User.findById(user.id), business)
    expect(res.points).toEqual(1)
    expect(res.currentLevel.name).toEqual(level2.name)
    expect(res.newRewards.length).toEqual(1)
    expect(res.newRewards[0].name).toEqual(reward2.name)

    // Give another customer point
    await customerService.updateCustomerProperties(user.id, { points: 2 })
    res = await customerService.updateCustomerLevel(await User.findById(user.id), business)
    // Should not change (except for points)
    expect(res.points).toEqual(2)
    expect(res.currentLevel.name).toEqual(level2.name)
    expect(res.newRewards.length).toEqual(0)
  })

  const mockCustomerLevelData = async (customerLevelSince) => {
    const business = {
      public: { customerLevels: defaultCustomerLevels }
    }
    business.public.customerLevels[1].pointsFee = {
      points: 25,
      period: 1000 * 60 * 60 * 24 * 30
    }
    const user = await new User({
      customerData: {
        customerLevel: {
          since: customerLevelSince,
        },
        properties: {
          points: 200
        }
      }
    }).save()

    return {
      business,
      user
    }
  }

  it('does not withdraw when it should not', async () => {
    const since = Date.now() - 10_000
    const { user, business } = await mockCustomerLevelData(since)

    // Should not change
    await customerService.checkCustomerLevelExpires(user, business)
    const userById = await User.findById(user.id)
    expect(userById.customerData.properties.points).toEqual(200)
    expect(new Date(userById.customerData.customerLevel.since).getTime()).toEqual(since)
  })


  it('withdraw points fee when it should', async () => {
    const since = Date.now() - 1000 * 60 * 60 * 24 * 30 - 10_000
    const { user, business } = await mockCustomerLevelData(since)

    // Should change
    await customerService.checkCustomerLevelExpires(user, business)
    const userById = await User.findById(user.id)
    await sleep(20)
    expect(userById.customerData.properties.points).toEqual(175)
    expect(new Date(userById.customerData.customerLevel.since).getTime()).toBeGreaterThan(since)
  })

})


afterAll(() => {
  closeDatabase()
})
