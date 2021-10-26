import role from "../src/models/role"
import mongoose from "mongoose"
import Business from "../src/models/business"
import userService from "../src/services/userService"
import customerService from "../src/services/customerService"
import productService from "../src/services/productService"
import campaignService from "../src/services/campaignService"
// Params for the first business
const params = { reqParams: {} }
// Params for the other business
const otherParams = { reqParams: {} }

beforeAll(async () => {
  const url = 'mongodb://127.0.0.1/loyalty-role-test'
  await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  await mongoose.connection.db.dropDatabase()

  await initParams(params)
  await initParams(otherParams)
})


async function initParams(paramsObj) {
  await new Business({}).save()
  const userId = (await userService.create({})).id
  paramsObj.userId = userId
  paramsObj.reqParams.userId = paramsObj.userId

  paramsObj.reqParams.productId = (await productService.create({ name: 'Pizza' })).id
  paramsObj.reqParams.campaignId = (await campaignService.create({ name: 'Sick Campaign' })).id

  const purchases = await customerService.addPurchase(userId, { categories: ['5e2721e1dab8355d82d53379'] })
  paramsObj.reqParams.purchaseId = purchases[0].id
}

// Not all but many permissions are tested here

// ADMIN
describe('admin', () => {
  it('should have permission to test:example ', () => {
    expect.assertions(1)
    return expect(role.hasPermission('admin', 'test:example', params)).resolves.toBeTruthy()
  })

  it('should have permission to test:* ', () => {
    expect.assertions(1)
    return expect(role.hasPermission('admin', 'test:*', params)).resolves.toBeTruthy()
  })

  it('should have permission to * ', () => {
    expect.assertions(1)
    return expect(role.hasPermission('admin', '*', params)).resolves.toBeTruthy()
  })
})

// BUSINESS
describe('business', () => {
  it('should have permission to campaign:update', () => {
    expect.assertions(1)
    return expect(role.hasPermission('business', 'campaign:create', params)).resolves.toBeTruthy()
  })

  it('should have permission to product:*', () => {
    expect.assertions(1)
    return expect(role.hasPermission('business', 'product:*', params)).resolves.toBeTruthy()
  })

  it('should have permission to purchase:create', () => {
    expect.assertions(1)
    return expect(role.hasPermission('business', 'purchase:create', params)).resolves.toBeTruthy()
  })

  it('should not should have permission to *', () => {
    expect.assertions(1)
    return expect(role.hasPermission('business', '*', params)).resolves.toBeFalsy()
  })

})

// USER
describe('user', () => {
  it('should not should have permission to *', () => {
    expect.assertions(1)
    return expect(role.hasPermission('user', '*', params)).resolves.toBeFalsy()
  })

  it('should not should have permission to campaign:*', () => {
    expect.assertions(1)
    return expect(role.hasPermission('user', 'campaign:*', params)).resolves.toBeFalsy()
  })

  it('should not should have permission to product:*', () => {
    expect.assertions(1)
    return expect(role.hasPermission('user', 'product:*', params)).resolves.toBeFalsy()
  })

  it('should not should have permission to purchase:*', () => {
    expect.assertions(1)
    return expect(role.hasPermission('user', 'purchase:*', params)).resolves.toBeFalsy()
  })

  it('should have permission to product:list', () => {
    expect.assertions(1)
    return expect(role.hasPermission('user', 'product:list', params)).resolves.toBeTruthy()
  })

  it('should have permission to campaign:list', () => {
    expect.assertions(1)
    return expect(role.hasPermission('user', 'campaign:list', params)).resolves.toBeTruthy()
  })

  it('should have permission to user:create', () => {
    expect.assertions(1)
    return expect(role.hasPermission('user', 'user:create', params)).resolves.toBeTruthy()
  })
})

afterAll(() => {
  mongoose.connection.close()
})
