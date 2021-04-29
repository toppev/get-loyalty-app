const { initDatabase, closeDatabase } = require('./testUtils')
const Campaign = require('../src/models/campaign')

beforeAll(async () => {
  await initDatabase('campaignService')
})

describe('campaign', () => {


  it('', async () => {
    await new Campaign({ name: 'test campaign', requirements: [{ type: 'stamps', values: [10] }] }).save()
    const campaign = (await Campaign.find())[0]
    expect(campaign.totalStampsNeeded).toBe(10)
  })

})

afterAll(() => {
  closeDatabase()
})
