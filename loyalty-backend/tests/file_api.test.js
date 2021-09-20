const fs = require('fs')
const businessService = require('../src/services/businessService')
const User = require('../src/models/user')
const app = require('../app')
const api = require('supertest')(app)
const { initDatabase, closeDatabase } = require('./testUtils')

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
  })

  it('upload and get file', async () => {
    const uploadRes = await api
      .post(`/file/upload`)
      .type('multipart/form-data')
      .attach('file', 'testresources/icon-192x192.png')
      .set('Cookie', cookie)
      .expect(200)
    const fileId = uploadRes.body?.data?.[0]
    expect(fileId).toBeDefined()

    const getRes = await api
      .get(`/file/${fileId}`)
      .set('Cookie', cookie)
      .expect(200)

    expect(getRes.headers['content-type']).toBe('image/png')

    const buf = await fs.promises.readFile('testresources/icon-192x192.png')
    expect(getRes.body).toEqual(buf)
  })

})

afterAll(() => {
  closeDatabase()
})
