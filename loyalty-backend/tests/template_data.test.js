const { initDatabase, closeDatabase } = require('./testUtils')
const businessService = require('../src/services/businessService')
const User = require('../src/models/user')
const Page = require('../src/models/page')
const app = require('../app')
const fs = require("fs")
const pageService = require("../src/services/pageService")
const api = require('supertest')(app)
const FileUpload = require('../src/models/fileUpload')
const { loadDefaultTemplates } = require("../src/services/templateService")
const axios = require("axios")

const businessParams = { email: "example@email.com", public: { address: 'this is an address' } }

beforeAll(async () => {
  await initDatabase('page')
})

jest.mock("axios")

let page

describe('page templates', () => {

  beforeAll(async () => {
    const user = await (new User()).save()
    await businessService.createBusiness(businessParams, user.id)
    page = await pageService.createPage({ name: 'test page', stage: 'published', template: true })
    const fileData = await fs.promises.readFile('testresources/main.js')
    await pageService.uploadStaticFile(page.id, fileData, 'main.js', {})
    await (new FileUpload({ _id: 'page_common/somefile.txt' })).save()
    expect((await FileUpload.find({})).length).toBe(2)
  })

  it('/templates exports correct data', async () => {
    const res = await api
      .get('/page/templates')
      .expect(200)
    expect(res.body.templates.length).toBe(1)
    expect(res.body.templates[0].page.name).toBe('test page')
    const uploads = res.body.templates[0].uploads
    expect(uploads.length).toBe(1)
    expect(res.body.common.uploads.length).toBe(1)
  })

  it('created page from templates', async () => {
    const templateData = await api
      .get('/page/templates')
      .expect(200)
    await Page.collection.drop()
    await FileUpload.collection.drop()

    axios.get.mockResolvedValue({ data: templateData.body })

    await loadDefaultTemplates(templateData.body.templates.map(it => it.page._id))
    const pages = await Page.find({})
    expect(pages.length).toBe(1)

    const newPageId = pages[0].id
    const res = await api
      .get(`/page/${newPageId}/static/main.js`)
      .expect(200)
    const fileAsString = await fs.promises.readFile('testresources/main.js', 'utf8')
    expect(res.headers['content-type']).toBe('application/javascript; charset=utf-8')
    expect(res.text).toEqual(fileAsString)

    // The common file was cloned
    await api
      .get(`/page/common/static/somefile.txt`)
      .expect(200)
  })

})

afterAll(() => {
  closeDatabase()
})
