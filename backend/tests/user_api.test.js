import { closeDatabase, initDatabase, sleep } from "./testUtils"

import userService from "../src/services/userService"
import User from "../src/models/user"
import ResetPassword from "../src/models/passwordReset"
import app from "../app"
import supertest from "supertest"

const api = supertest(app)

const userParams = { email: "example@email.com", password: "password123" }
let userId

beforeAll(async () => {
  await initDatabase('user')
  userId = (await new User(userParams).save())._id
})

describe('Not logged in user should', () => {

  it('register without password', async () => {
    const secondUserParams = { email: 'example2@email.com', acceptAll: true }
    const res = await api
      .post('/user/register')
      .send(secondUserParams)
      .expect(200)
    const user = await userService.getById(res.body._id)
    expect(user.hasPassword).toBe(false)
    expect(user.email).toBe(secondUserParams.email)
  })

  it('register with password', async () => {
    const testUserParams = { email: 'example3@email.com', password: "asdasdasd", acceptAll: true }
    const res = await api
      .post('/user/register')
      .send(testUserParams)
      .expect(200)
    const user = await userService.getById(res.body._id)
    expect(user.hasPassword).toBe(true)
  })

  it('forgotPassword', async () => {
    await api
      .post('/user/forgotpassword')
      .send(userParams)
      .expect(200)
    const reset = await ResetPassword.findOne({})
    expect(reset.token).toEqual(expect.anything())
    expect(reset.userId).toEqual(expect.anything())
  })

  it('resetPassword', async () => {
    const buffer = (await import('crypto')).randomBytes(16)
    const token = buffer.toString('hex')
    const reset = new ResetPassword({ token, userId })
    await reset.save()
    expect(reset.usedAt).toBeUndefined()
    const res = await api
      .get('/user/resetPassword/' + token)
      .expect(200)
    expect(res.body.success).toEqual(true)
    const afterReset = await ResetPassword.findOne({ token })
    expect(afterReset.usedAt).toBeTruthy()
    expect(new Date(afterReset.usedAt).getTime()).toBeLessThanOrEqual(Date.now())
  })

  it('login (local)', async () => {
    const res = await api
      .post('/user/login/local')
      .send(userParams)
      .expect(200)
    expect(res.body.email).toEqual(userParams.email)
  })


  it('not login: wrong password (local)', async () => {
    await api
      .post('/user/login/local')
      .send({ email: userParams.email, password: 'abc123%' })
      .expect(401)
  })

})

describe('Logged in user should', () => {

  // Storing cookies for session here
  let cookie

  beforeAll(async () => {
    // Just use this to login for now
    const res = await api
      .post('/user/login/local')
      .send(userParams)
      .expect(200)
    // Setting the cookie
    cookie = res.headers['set-cookie']
  })

  it('profile', async () => {
    const res = await api
      .get('/user/profile')
      .set('Cookie', cookie)
      .expect(200)
    // Enough good
    expect(res.body.email).toEqual(userParams.email)
  })

  it('get self', async () => {
    const res = await api
      .get('/user/' + userId)
      .set('Cookie', cookie)
      .expect(200)
    // Enough good
    expect(res.body.email).toEqual(userParams.email)
  })

  it('patch self', async () => {
    // random email
    const email = `example${Math.random() * 10000 || 0}@email.com`
    const res = await api
      .patch('/user/' + userId)
      .set('Cookie', cookie)
      .send({ email: email, acceptAll: true })
      .expect(200)
    expect(res.body.email).toEqual(email)
    // And was saved in database
    const user = await userService.getById(res.body._id)
    expect(user.email).toEqual(email)
  })

  it('logout', async () => {
    const res = await api
      .post('/user/logout')
      .set('Cookie', cookie)
      .expect(200)
    expect(res.headers['set-cookie'][0].startsWith('loyalty_session=;'))
  })

  it('delete self', async () => {
    const res = await api
      .delete('/user/' + userId)
      .set('Cookie', cookie)
      .expect(200)
    const user = await userService.getById(res.body._id)
    expect(user).toBeNull()
  })

})

describe('userService', () => {

  it('lastVisit updates', async () => {
    const user = await userService.create({ lastVisit: (Date.now() - 1000) })
    const old = user.lastVisit
    await userService.markLastVisit(user)
    const now = (await userService.getById(user.id)).lastVisit
    expect(old).toBeTruthy()
    expect(now).toBeTruthy()
    expect(old).not.toEqual(now)
  })
})

/*
* Testing patching, deleting and getting other users is not currently tested.
* Only site admins can do it anyway. Might implement later
*/

afterAll(async () => {
  await sleep(2000)
  closeDatabase()
})
