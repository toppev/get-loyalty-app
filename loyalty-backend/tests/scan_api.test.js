const { initDatabase, closeDatabase } = require('./testUtils')
const businessService = require('../src/services/businessService')
const customerService = require('../src/services/customerService')
const campaignService = require('../src/services/campaignService')
const productService = require('../src/services/productService')
const categoryService = require('../src/services/categoryService')
const User = require('../src/models/user')
const Campaign = require('../src/models/campaign')
const app = require('../app')
const api = require('supertest')(app)

const userParams = { email: "examplescanner@email.com", password: "password123" }

beforeAll(async () => {
  await initDatabase('scan')
})

describe('Logged in user can', () => {

  let userId
  let cookie

  beforeAll(async () => {
    // Login
    userId = (await new User(userParams).save())._id
    const res = await api
      .post('/user/login/local')
      .send(userParams)
      .expect(200)
    cookie = res.headers['set-cookie']
    await businessService.createBusiness({}, userId)
  })

  it('scan (get) userId and rewardId', async () => {
    const category1 = await categoryService.create({ name: 'test category1' })
    const reward = { name: 'Free items', itemDiscount: 'Free!', categories: [category1] }
    const rewards = await customerService.addReward(userId, reward)
    const rewardId = rewards[0]._id
    const scan = `${userId}:${rewardId}`
    const res = await api
      .get(`/scan/${scan}`)
      .set('Cookie', cookie)
      .expect(200)
    expect(res.body.reward.categories.length).toBe(1)
    expect(res.body.reward.categories[0].name).toBe(category1.name)
    expect(res.body.questions).toBeDefined()
    expect(res.body.user.customerData).toBeDefined()
    expect(res.body.reward._id).toBeDefined()
    const questions = res.body.questions
    expect(questions[questions.length - 1].question).toBe('Use reward "Free items"?')
  })

  it('scan (get) userId', async () => {
    const now = Date.now()
    // Has ended
    const campaign1 = { name: 'Campaign #1', end: (now - 10000) }
    // On going with product
    const product = await productService.create({ name: 'Product1' })
    const category = await categoryService.create({ name: 'Category1' })
    const campaign2 = {
      name: 'Campaign #2',
      start: now,
      end: (now + 10000),
      products: [product],
      categories: [category]
    }
    // Hasn't started
    const campaign3 = {
      name: 'Campaign #2',
      start: (now + 10000)
    }
    const product2 = await productService.create({ name: 'Product2' })
    // No rewards available, this campaign should be ignored (won't ask about product2)
    // (as no one can receive the reward anymore)
    const campaign4 = {
      name: 'Campaign #2',
      start: now,
      end: (now + 10000),
      maxRewards: { total: 1 },
      rewardedCount: 1,
      products: [product2],
    }
    await campaignService.create(campaign1)
    await campaignService.create(campaign2)
    await campaignService.create(campaign3)
    await campaignService.create(campaign4)
    const scan = userId
    const res = await api
      .get(`/scan/${scan}`)
      .set('Cookie', cookie)
      .expect(200)
    expect(res.body.questions).toBeDefined()
    expect(res.body.user.customerData).toBeDefined()
    expect(res.body.campaigns.length).toBe(1)
    expect(res.body.campaigns[0].name).toBe(campaign2.name)

    expect(res.body.questions.length).toBe(3)
    expect(res.body.questions[0].question).toBe('Select categories')
    expect(res.body.questions[1].options).toStrictEqual(['Product1'])
    // Just to be sure changes won't break this test
    expect(res.body.questions[1].options).not.toContain('Product2')
  })

  it('scan (use) userId:rewardId', async () => {
    const reward = { name: 'Free items', itemDiscount: 'Free!' }
    const rewards = await customerService.addReward(userId, reward)
    // Delete all campaigns so we won't receive anything we shouldn't
    await Campaign.deleteMany({})
    const rewardId = rewards[0]._id
    const scan = `${userId}:${rewardId}`
    const answers = [{ id: 'confirm', options: ['Yes'] }]
    const res = await api
      .post(`/scan/${scan}`)
      .send({ answers })
      .set('Cookie', cookie)
      .expect(200)
    expect(res.body.newRewards.length).toBe(0)
    expect(res.body.message).toBeDefined()
  })


  it('scan (use) userId', async () => {
    const reward = { name: 'Received reward', itemDiscount: '110%' }
    const campaign = { name: 'Test Campaign', endReward: [reward] }
    await campaignService.create(campaign)

    const answers = [{ id: 'confirm', options: ['Yes'] }]
    const scan = userId
    const res = await api
      .post(`/scan/${scan}`)
      .set('Cookie', cookie)
      .send({ answers })
      .expect(200)
    expect(res.body.newRewards.length).toBe(1)
    expect(res.body.newRewards[0].name).toBe(reward.name)
  })

})

afterAll(() => {
  closeDatabase()
})
