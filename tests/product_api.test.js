const { initDatabase, closeDatabase } = require('./testUtils');
const businessService = require('../src/services/businessService');
const User = require('../src/models/user');
const app = require('../app');
const api = require('supertest')(app);

const businessParams = { email: "example@email.com", public: { address: 'this is an address' } };
const userParams = { email: "example@email.com", password: "password123" };
let userId;

beforeAll(async () => {
    await initDatabase('product');
});

describe('Logged in user with permissions can', () => {

    let cookie;
    let businessId;
    let productId;

    beforeAll(async () => {
        // Login
        userId = (await new User(userParams).save())._id;
        const res = await api
            .post('/user/login/local')
            .send(userParams)
            .expect(200);
        cookie = res.headers['set-cookie'];
        businessId = (await businessService.createBusiness(businessParams, userId)).id;
    });

    it('create product', async () => {
        const productData = { name: "Test Product" }
        const res = await api
            .post(`/business/${businessId}/product`)
            .set('Cookie', cookie)
            .send(productData)
            .expect(200);
        productId = res.body._id;
        expect(res.body.name).toBe(productData.name);
    });

    it('update product', async () => {
        const updatedData = { name: "Test Product2" }
        const res = await api
            .patch(`/business/${businessId}/product/${productId}`)
            .set('Cookie', cookie)
            .send(updatedData)
            .expect(200);
        expect(res.body.name).toBe(updatedData.name);

    });

    it('get product', async () => {
        const res = await api
            .get(`/business/${businessId}/product/${productId}`)
            .set('Cookie', cookie)
            .expect(200);
        expect(res.body._id).toBe(productId);
    });

    it('get all', async () => {
        const res = await api
            .get(`/business/${businessId}/product/all`)
            .set('Cookie', cookie)
            .expect(200);
        expect(res.body[0]._id).toBe(productId);
    });


    it('delete product', async () => {
        await api
            .delete(`/business/${businessId}/product/${productId}`)
            .set('Cookie', cookie)
            .expect(200);
    });

});

afterAll(() => {
    closeDatabase();
});