const fs = require('fs')
const businessService = require('../src/services/businessService')
const User = require('../src/models/user')
const app = require('../app')
const api = require('supertest')(app)
const { initDatabase, closeDatabase } = require('./testUtils')

const testPageData = { gjs: { "gjs-components": '["stuff"]', "gjs-style": '["more stuff"]' } }
const businessParams = { email: "example@email.com", public: { address: 'this is an address' } }
const userParams = { email: "example@email.com", password: "password123" }
let userId

beforeAll(async () => {
  await initDatabase('business')
})

describe('fileController', () => {

  let cookie

  beforeAll(async () => {
    // Login
    userId = (await new User(userParams).save())._id
    const res = await api
      .post('/user/login/local')
      .send(userParams)
      .expect(200)
    // Setting the cookie
    cookie = res.headers['set-cookie']
    await businessService.createBusiness(businessParams, userId)

    // Create a page for this test
    const pageCreate = await api
      .post(`/page`)
      .set('Cookie', cookie)
      .send(testPageData)
      .expect(200)
    testPageData.id = pageCreate.body._id
  })

  it('upload and get file', async () => {
    const uploadRes = await api
      .post(`/page/${testPageData.id}/upload-static`)
      .type('multipart/form-data')
      .attach('file', 'testresources/icon-192x192.png')
      .set('Cookie', cookie)
      .expect(200)
    const fileURL = uploadRes.body?.data?.[0]
    console.log(fileURL)
    expect(fileURL).toBeDefined()
    expect(fileURL.startsWith(process.env.PUBLIC_URL + '/page'))

    const getRes = await api
      .get(fileURL.substring((process.env.PUBLIC_URL).length))
      .expect(200)

    expect(getRes.headers['content-type']).toBe('image/png')

    const buf = await fs.promises.readFile('testresources/icon-192x192.png')
    expect(getRes.body).toEqual(buf)
  })

})

afterAll(() => {
  closeDatabase()
})
