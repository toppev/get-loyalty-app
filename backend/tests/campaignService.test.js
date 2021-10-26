import { closeDatabase, initDatabase } from "./testUtils"

import Campaign from "../src/models/campaign"

beforeAll(async () => {
  await initDatabase('campaignService')
})

describe('campaign', () => {


  it('creates a stamp campaign', async () => {
    await new Campaign({ name: 'test campaign', requirements: [{ type: 'stamps', values: [10] }] }).save()
    const campaign = (await Campaign.find())[0]
    expect(campaign.totalStampsNeeded).toBe(10)
  })

})

afterAll(() => {
  closeDatabase()
})
