import { closeDatabase, initDatabase } from "./testUtils"

import businessService from "../src/services/businessService"
import User from "../src/models/user"
import app from "../app"
import fs from "fs"
import supertest from "supertest"

const api = supertest(app)

const businessParams = { email: "example@email.com", public: { address: 'this is an address' } }
const userParams = { email: "example@email.com", password: "password123" }
let userId

const testPageData = { gjs: { "gjs-components": '["stuff"]', "gjs-style": '["more stuff"]' } }
const updatedPageData = { gjs: { "gjs-components": '["differentStuff"]', "gjs-styles": '["more stuff"]' } }
const updatedPageData2 = { gjs: { "gjs-components": '["differentStuff2"]', "gjs-styles": '["more different stuff"]' } }

beforeAll(async () => {
  await initDatabase('page')
})

describe('Logged in user with permissions can', () => {

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

  it('save page', async () => {
    const res = await api
      .post(`/page`)
      .set('Cookie', cookie)
      .send(testPageData)
      .expect(200)
    const resId = res.body._id
    expect(resId).toBeDefined()
    // eslint-disable-next-line require-atomic-updates
    testPageData.id = resId
  })

  it('update page', async () => {
    await api
      .post(`/page/${testPageData.id}`)
      .set('Cookie', cookie)
      .send(updatedPageData)
      .expect(200)
  })

  it('get page', async () => {
    const res = await api
      .get(`/page/${testPageData.id}`)
      .set('Cookie', cookie)
      .expect(200)
    expect(res.body.gjs).toStrictEqual(updatedPageData.gjs)
  })


  it('update page gjs only', async () => {
    await api
      .post(`/page/${testPageData.id}/?gjsOnly=true`)
      .set('Cookie', cookie)
      .send(updatedPageData2.gjs)
      .expect(200)
  })

  it('get page gjs only', async () => {
    const res = await api
      .get(`/page/${testPageData.id}/?gjsOnly=true`)
      .set('Cookie', cookie)
      .expect(200)
    expect(res.body).toStrictEqual(updatedPageData2.gjs)
  })

  it('list pages', async () => {
    const res = await api
      .get(`/page/list`)
      .set('Cookie', cookie)
      .expect(200)
    expect(res.body[0].gjs).toBeFalsy()
    expect(res.body[0]._id).toBeTruthy()
  })

  it('upload page html', async () => {
    await api
      .post(`/page/${testPageData.id}/upload`)
      .set('Cookie', cookie)
      .send({ html: '<p>test</p>' })
      .expect(200)
  })

  it('get page html', async () => {
    const res = await api
      .get(`/page/${testPageData.id}/html`)
      .set('Cookie', cookie)
      .expect(200)
    expect(res.text).toBe('<p>test</p>')
  })

  // language=HTML
  const htmlPage = `
    <div>
      <h1>Hello {{user.email}}!</h1>
      <br>
      <p>This is a test with åäö</p>
    </div>
  `

  // language=CSS
  const pageCss = `
    h1 {
      color: red;
    }
  `

  it('replace page html', async () => {
    await api
      .post(`/page/${testPageData.id}/upload`)
      .set('Cookie', cookie)
      .send({ html: htmlPage, css: pageCss })
      .expect(200)
  })

  // language=HTML
  const expectedHtml = `
    <div>
      <h1>Hello ${userParams.email}!</h1>
      <br>
      <p>This is a test with åäö</p>
    </div>
  `
  // language=CSS
  const expectedCSS = `
    h1 {
      color: red;
    }
  `


  it('get page html with placeholder', async () => {
    const htmlRes = await api
      .get(`/page/${testPageData.id}/html`)
      .set('Cookie', cookie)
      .expect(200)
    expect(htmlRes.text).toBe(expectedHtml)

    const cssRes = await api
      .get(`/page/${testPageData.id}/static/main.css`)
      .set('Cookie', cookie)
      .expect(200)
    expect(cssRes.text).toBe(expectedCSS)
  })

  it('upload the JavaScript file', async () => {
    await api
      .post(`/page/${testPageData.id}/upload-static?fileName=main.js`)
      .type('multipart/form-data')
      .attach('file', 'testresources/temp_main.js')
      .set('Cookie', cookie)
      .expect(200)

    // Should update, in the next test we check if it's the correct file
    await api
      .post(`/page/${testPageData.id}/upload-static?fileName=main.js`)
      .type('multipart/form-data')
      .attach('file', 'testresources/main.js')
      .set('Cookie', cookie)
      .expect(200)
  })

  it('get JavaScript file', async () => {
    const res = await api
      .get(`/page/${testPageData.id}/static/main.js`)
      .expect(200)
    expect(res.headers['content-type']).toBe('application/javascript; charset=utf-8')
    const fileAsString = await fs.promises.readFile('testresources/main.js', 'utf8')
    expect(res.text).toEqual(fileAsString)
  })

  it('upload common JS/CSS files', async () => {
    await api
      .post(`/page/common/upload-static?fileName=main.js`)
      .type('multipart/form-data')
      .attach('file', 'testresources/common_main.js')
      .set('Cookie', cookie)
      .expect(200)

    await api
      .post(`/page/common/upload-static?fileName=main.css`)
      .type('multipart/form-data')
      .attach('file', 'testresources/common_main.css')
      .set('Cookie', cookie)
      .expect(200)

    const mainJsRes = await api
      .get(`/page/common/static/main.js`)
      .expect(200)
    expect(mainJsRes.headers['content-type']).toBe('application/javascript; charset=utf-8')
    const commonJSString = await fs.promises.readFile('testresources/common_main.js', 'utf8')
    expect(mainJsRes.text).toEqual(commonJSString)

    const commonCSSRes = await api
      .get(`/page/common/static/main.css`)
      .expect(200)
    expect(commonCSSRes.headers['content-type']).toBe('text/css; charset=utf-8')
    const commonCSSString = await fs.promises.readFile('testresources/common_main.css', 'utf8')
    expect(commonCSSRes.text).toEqual(commonCSSString)
  })

})

afterAll(() => {
  closeDatabase()
})
