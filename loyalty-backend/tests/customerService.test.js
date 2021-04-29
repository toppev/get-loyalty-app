const { initDatabase, closeDatabase } = require('./testUtils')
const User = require('../src/models/user')
const Business = require('../src/models/business')
const customerService = require('../src/services/customerService')

beforeAll(async () => {
  await initDatabase('customerService')
})

describe('customer level', () => {

  it('', async () => {
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


})


afterAll(() => {
  closeDatabase()
})
