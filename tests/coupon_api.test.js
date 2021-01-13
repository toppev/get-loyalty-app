const { initDatabase, closeDatabase } = require('./testUtils');
const businessService = require('../src/services/businessService');
const campaignService = require('../src/services/campaignService');
const userService = require('../src/services/userService');
const User = require('../src/models/user');
const app = require('../app');
const api = require('supertest')(app);

const userParams = { email: "coupon.test@email.com", password: "password123" };

let cookie;
let business;
let userId;
let endReward;

// Coupons should be case insensitive
const couponCode = 'test_COUPON'

beforeAll(async () => {
    await initDatabase('category');
    // Login
    userId = (await new User(userParams).save())._id;
    const res = await api
        .post('/user/login/local')
        .send(userParams);
    // Setting the cookie
    cookie = res.headers['set-cookie'];
    business = await businessService.createBusiness({}, userId)
    endReward = { name: "Test Reward", itemDiscount: "20% OFF" }
    const campaignParam = { name: "Test Campaign", couponCode: couponCode, endReward: [endReward] }
    await campaignService.create(campaignParam);
});

describe('Logged in user can', () => {

    it('claim coupon rewards', async () => {
        const res = await api
            .post(`/coupon/${couponCode.toLowerCase()}`) // Make sure lowercase works
            .set('Cookie', cookie)
            .expect(200);
        expect(res.body.rewards.length).toBe(1); // Enough good
    });

    it('not reclaim coupon rewards', async () => {
        await api
            .post(`/coupon/${couponCode.toUpperCase()}`) // Make sure uppercase works
            .set('Cookie', cookie)
            .expect(403);
        const user = await userService.getById(userId)
        const rewards = user.customerData.rewards;
        expect(rewards.length).toBe(1)
    });

});


afterAll(() => {
    closeDatabase();
});