import { initDatabase } from "./testUtils"

import userService from "../src/services/userService"
import app from "../app"
import Business from "../src/models/business"
import supertest from "supertest"

const api = supertest(app)

const levels = [{
  name: 'test',
  rewards: [{ name: 'testReward', itemDiscount: 'free' }]
}]

beforeAll(async () => {
  await initDatabase('join_rewards')

  await new Business({ public: { customerLevels: levels } }).save()
})

describe('Should receive initial rewards on register', () => {

  it('register without password', async () => {
    const secondUserParams = { email: 'example123@email.com', acceptAll: true }
    const res = await api
      .post('/user/register')
      .send(secondUserParams)
      .expect(200)
    const { customerData } = await userService.getById(res.body._id)
    expect(customerData.rewards.length).toBe(levels[0].rewards.length)
    expect(customerData.rewards[0].name).toBe(levels[0].rewards[0].name)
  })

})
