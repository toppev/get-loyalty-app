import { closeDatabase, initDatabase } from "./testUtils"

import businessService from "../src/services/businessService"
import campaignService from "../src/services/campaignService"
import customerService from "../src/services/customerService"
import userService from "../src/services/userService"
import User from "../src/models/user"
import app from "../app"
import supertest from "supertest"

const api = supertest(app)

const userParams = { email: "coupon.test@email.com", password: "password123" }
const secondUserParams = { email: "referrer.test@example.com", password: "password123" }

let cookie
let userId
let endReward

let referrerUserId

// Coupons should be case insensitive
const couponCode = 'test_COUPON'

beforeAll(async () => {
  await initDatabase('category')
  // Login
  userId = (await new User(userParams).save())._id
  referrerUserId = (await new User(secondUserParams).save())._id
  const res = await api
    .post('/user/login/local')
    .send(userParams)
  // Setting the cookie
  cookie = res.headers['set-cookie']
  await businessService.createBusiness({}, userId)
  endReward = { name: "Test Reward", itemDiscount: "20% OFF" }
  const basicCouponCampaign = {
    name: "Test Campaign",
    couponCode: couponCode,
    endReward: [endReward],
  }
  await campaignService.create(basicCouponCampaign)
  const referralCampaign = {
    name: "Referral Campaign",
    endReward: [endReward],
    requirements: [{
      type: 'referral',
      values: ['both', 'has-purchase']
    }]
  }
  await campaignService.create(referralCampaign)
})

describe('Logged in user coupons', () => {

  it('claim coupon rewards', async () => {
    const res = await api
      .post(`/coupon/${couponCode.toLowerCase()}`) // Make sure lowercase works
      .set('Cookie', cookie)
      .expect(200)
    expect(res.body.rewards.length).toBe(1) // Enough good
  })

  it('not reclaim coupon rewards', async () => {
    await api
      .post(`/coupon/${couponCode.toUpperCase()}`) // Make sure uppercase works
      .set('Cookie', cookie)
      .expect(403)
    const user = await userService.getById(userId)
    const rewards = user.customerData.rewards
    expect(rewards.length).toBe(1)
  })

})

describe('Referral coupons', () => {

  it('must have purchased before', async () => {
    const res = await api
      .post(`/coupon/referral?referrer=${referrerUserId}`)
      .set('Cookie', cookie)
      .expect(403)
    expect(res.body.message).toContain("purchased")
  })

  it('can refer after purchase', async () => {
    await customerService.addPurchase(referrerUserId, {}) // fake a purchase
    await customerService.updateRewards(userId, []) // ensure rewards are cleared
    const res = await api
      .post(`/coupon/referral?referrer=${referrerUserId}`)
      .set('Cookie', cookie)
      .expect(200)
    expect(res.body).toBeDefined()
    expect(res.body.rewards.length).toBe(1)
    const user = await User.findById(userId)
    expect(user.referrer).toEqual(referrerUserId)
    expect(user.customerData.rewards.length).toBe(1)
    const referrer = await User.findById(referrerUserId)
    expect(referrer.customerData.rewards.length).toBe(1)
    // FIXME: expect(referrer.referrerFor).toEqual([userId])
  })

  it('already referred (or received all)', async () => {
    // Should fail because the user was already referred
    await api
      .post(`/coupon/referral?referrer=${referrerUserId}`)
      .set('Cookie', cookie)
      .expect(403)
  })

  it('refers someone else and reaches limit', async () => {
    // Create another user and attempt registering the referrerUserId as the referrer
    // Should fail because that user can only refer one user
    let newUserParams = { email: "referred2.test@example.com", password: "password123" }
    await new User(newUserParams).save()
    const login = await api
      .post('/user/login/local')
      .send(newUserParams)
    const newCookie = login.headers['set-cookie']
    const res = await api
      .post(`/coupon/referral?referrer=${referrerUserId}`)
      .set('Cookie', newCookie)
      .expect(403)
    expect(res.body.message).toContain("reached the limit")

  })

})

describe('refer', () => {

  it('can not refer self', async () => {
    const user = await User.findById(userId)
    user.customerData.rewards = []
    user.referrer = undefined
    await user.save()

    await customerService.addPurchase(userId, {}) // fake a purchase
    const res = await api
      .post(`/coupon/referral?referrer=${userId}`)
      .set('Cookie', cookie)
      .expect(403)
    expect(res.body.message).toContain("yourself")
  })
})

afterAll(() => {
  closeDatabase()
})
