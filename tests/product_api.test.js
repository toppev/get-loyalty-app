const { initDatabase, closeDatabase } = require('./testUtils');
const businessService = require('../src/services/businessService');
const categoryService = require('../src/services/categoryService');
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
    let productId;

    beforeAll(async () => {
        // Login
        userId = (await new User(userParams).save())._id;
        const res = await api
            .post('/user/login/local')
            .send(userParams)
            .expect(200);
        cookie = res.headers['set-cookie'];
        await businessService.createBusiness(businessParams, userId);
    });

    it('create product', async () => {
        const testCategory = await categoryService.create({ name: 'test category' })
        const productData = { name: "Test Product", categories: [testCategory] }
        const res = await api
            .post(`/product`)
            .set('Cookie', cookie)
            .send(productData)
            .expect(200);
        productId = res.body._id;
        expect(res.body.name).toBe(productData.name);
    });

    it('update product', async () => {
        const updatedData = { name: "Test Product2" }
        const res = await api
            .patch(`/product/${productId}`)
            .set('Cookie', cookie)
            .send(updatedData)
            .expect(200);
        expect(res.body.name).toBe(updatedData.name);

    });

    it('get product', async () => {
        const res = await api
            .get(`/product/${productId}`)
            .set('Cookie', cookie)
            .expect(200);
        expect(res.body._id).toBe(productId);
        expect(res.body.categories[0].name).toBe('test category');
    });

    it('get all', async () => {
        const res = await api
            .get(`/product/all`)
            .set('Cookie', cookie)
            .expect(200);
        expect(res.body[0]._id).toBe(productId);
        expect(res.body[0].categories[0].name).toBe('test category');
    });


    it('delete product', async () => {
        await api
            .delete(`/product/${productId}`)
            .set('Cookie', cookie)
            .expect(200);
    });

});

afterAll(() => {
    closeDatabase();
});