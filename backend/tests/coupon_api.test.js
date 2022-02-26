import { closeDatabase, initDatabase } from "./testUtils"

import businessService from "../src/services/businessService"
import User from "../src/models/user"
import app from "../app"
import supertest from "supertest"

const api = supertest(app)

const businessParams = { email: "example@email.com", public: { address: 'this is an address' } }
const userParams = { email: "example@email.com", password: "password123" }

beforeAll(async () => {
  await initDatabase('coupons')
})

describe('Coupon API', () => {

  let cookie
  let couponId

  beforeAll(async () => {
    // Login
    const userId = (await new User(userParams).save())._id
    const res = await api
      .post('/user/login/local')
      .send(userParams)
      .expect(200)
    // Setting the cookie
    cookie = res.headers['set-cookie']
    await businessService.createBusiness(businessParams, userId)
  })

  it('create coupon', async () => {
    const couponParam = { reward: { name: 'Test reward' } }
    const res = await api
      .post(`/coupon`)
      .set('Cookie', cookie)
      .send(couponParam)
      .expect(200)
    couponId = res.body._id
    expect(couponId).toBeDefined()
    expect(res.body.reward.name).toBe(couponParam.reward.name)
  })

  it('update coupon', async () => {
    const newData = { expiration: { min: 1000 * 60 * 60 * 48 } }
    await api
      .patch(`/coupon/${couponId}`)
      .set('Cookie', cookie)
      .send(newData)
      .expect(200)
  })

  it('get all', async () => {
    const res = await api
      .get(`/coupon/list`)
      .set('Cookie', cookie)
      .expect(200)
    expect(res.body.length).toBeGreaterThanOrEqual(1)
    expect(res.body[0].expiration.min).toBe(86400000)
    expect(res.body[0].expiration.max).toBe(604800000)
  })


  it('delete coupon', async () => {
    await api
      .delete(`/coupon/${couponId}`)
      .set('Cookie', cookie)
      .expect(200)
    const res = await api
      .get(`/coupon/list`)
      .set('Cookie', cookie)
      .expect(200)
    expect(res.body.length).toBe(0)
  })

})

afterAll(() => {
  closeDatabase()
})
