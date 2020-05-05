const mongoose = require('mongoose');
const businessService = require('../src/services/businessService');
const campaignService = require('../src/services/campaignService');
const customerService = require('../src/services/customerService');
const userService = require('../src/services/userService');
const User = require('../src/models/user');
const app = require('../app');
const api = require('supertest')(app);

const businessParam = { email: "coupon.test.business@email.com", public: { address: 'this is an address' } };
const userParams = { email: "coupon.test@email.com", password: "password123" };

let cookie;
let business;
let userId;
let endReward;

const couponCode = 'TEST_COUPON'

beforeAll(async () => {
    const url = 'mongodb://127.0.0.1/kantis-coupon-test';
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

    endReward = { name: "Test Reward", itemDiscount: "20% OFF" }
    const campaignParam = { name: "Test Campaign", couponCode: couponCode, endReward: [endReward] }
    await campaignService.create(business.id, campaignParam);
});

describe('Logged in user can', () => {

    it('claim coupon rewards', async () => {
        const res = await api
            .post(`/business/${business.id}/coupon/${couponCode}`)
            .set('Cookie', cookie)
            .expect(200);
        expect(res.body.rewards.length).toBe(1); // Enough good
    });

    it('not reclaim coupon rewards', async () => {
        await api
            .post(`/business/${business.id}/coupon/${couponCode}`)
            .set('Cookie', cookie)
            .expect(403);
        const user = await userService.getById(userId)
        const data = await customerService.findCustomerData(user, business.id)
        const rewards = data.rewards;
        expect(rewards.length).toBe(1)
    });

});


afterAll(() => {
    mongoose.connection.close();
});