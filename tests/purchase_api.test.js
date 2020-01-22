const mongoose = require('mongoose');
const businessService = require('../src/services/businessService');
const User = require('../src/models/user');
const app = require('../app');
const api = require('supertest')(app);

const businessParam = { email: "purchase.test.business@email.com", public: { address: 'this is an address' } };
const userParams = { email: "purchase.test@email.com", password: "password123" };

let cookie;
let business;
let userId;

beforeAll(async () => {
    const url = 'mongodb://127.0.0.1/kantis-purchase-test';
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    await mongoose.connection.db.dropDatabase();
    // Login
    userId = (await new User(userParams).save())._id;

    const res = await api
        .post('/user/login/local')
        .send(userParams);
    // Setting the cookie
    cookie = res.headers['set-cookie'];
    // Create new business
    // TODO: maybe use service instead of requests
    const res2 = await api
        .post('/business/create')
        .send(businessParam)
        .set('Cookie', cookie);
    business = await businessService.getBusiness(res2.body._id);
});

describe('Logged in user with permission can', () => {

    let purchaseId;

    it('create purchase', async () => {
        const purchase = { userId, category: '5e2708e560885bbf21fbb9de' };
        const res = await api
            .post(`/business/${business.id}/purchase`)
            .set('Cookie', cookie)
            .send(purchase)
            .expect(200);
        purchaseId = res.body[0]._id;
        expect(res.body[0].category).toBe(purchase.category);
    });

    it('update purchase', async () => {
        const patchData = { category: '5e2756df4d931c1fe5b9013f' };
        const res = await api
            .patch(`/business/${business.id}/purchase/${purchaseId}`)
            .set('Cookie', cookie)
            .send(patchData)
            .expect(200);
        expect(res.body[0].category).toBe(patchData.category);
    });

    it('delete purchase', async () => {
        await api
            .delete(`/business/${business.id}/purchase/${purchaseId}`)
            .set('Cookie', cookie)
            .expect(200);
        // TODO check if it really was deleted
    });

});