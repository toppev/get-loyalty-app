const mongoose = require('mongoose');
const businessService = require('../src/services/businessService');
const customerService = require('../src/services/customerService');
const campaignService = require('../src/services/campaignService');
const User = require('../src/models/user');
const Campaign = require('../src/models/campaign');
const app = require('../app');
const api = require('supertest')(app);

const userParams = { email: "examplescanner@email.com", password: "password123" };

beforeAll(async () => {
    const url = 'mongodb://127.0.0.1/kantis-scan-test';
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    await mongoose.connection.db.dropDatabase();
});

describe('Logged in user can', () => {

    let userId;
    let business;
    let cookie;

    beforeAll(async () => {
        // Login
        userId = (await new User(userParams).save())._id;
        const res = await api
            .post('/user/login/local')
            .send(userParams)
            .expect(200);
        cookie = res.headers['set-cookie'];
        business = await businessService.createBusiness({}, userId);
    });

    it('scan (get) userId and rewardId', async () => {
        const reward = { name: 'Free items', itemDiscount: 'Free!' };
        const rewards = await customerService.addReward(userId, business._id, reward);
        const rewardId = rewards[0]._id;
        const scan = `${userId}:${rewardId}`;
        const res = await api
            .get(`/business/${business.id}/scan/${scan}`)
            .set('Cookie', cookie)
            .expect(200);
        expect(res.body.questions).toBeDefined();
        expect(res.body.customerData).toBeDefined();
        expect(res.body.reward._id).toBeDefined();
    });

    it('scan (get) userId', async () => {
        const now = Date.now();
        // Has ended
        const campaign1 = { name: 'Campaign #1', end: (now - 10000) };
        // On going
        const campaign2 = { name: 'Campaign #2', start: now, end: (now + 10000) };
        // Hasn't started
        const campaign3 = { name: 'Campaign #2', start: (now + 10000) };
        await campaignService.create(business._id, campaign1)
        await campaignService.create(business._id, campaign2)
        await campaignService.create(business._id, campaign3)

        const scan = userId;
        const res = await api
            .get(`/business/${business.id}/scan/${scan}`)
            .set('Cookie', cookie)
            .expect(200);
        expect(res.body.questions).toBeDefined();
        expect(res.body.customerData).toBeDefined();
        expect(res.body.campaigns.length).toBe(1);
        expect(res.body.campaigns[0].name).toBe(campaign2.name);
    });

    it('scan (use) userId:rewardId', async () => {
        const reward = { name: 'Free items', itemDiscount: 'Free!' };
        const rewards = await customerService.addReward(userId, business._id, reward);
        // Delete all campaigns so we won't receive anything we shouldn't
        await Campaign.deleteMany({});
        const rewardId = rewards[0]._id;
        const scan = `${userId}:${rewardId}`;
        const res = await api
            .post(`/business/${business.id}/scan/${scan}`)
            .set('Cookie', cookie)
            .expect(200);
        expect(res.body.newRewards.length).toBe(0);
        expect(res.body.message).toBeDefined();
    });


    it('scan (use) userId', async () => {
        const reward = { name: 'Received reward', itemDiscount: '110%' };
        const campaign = { name: 'Test Campaign', endReward: [reward] };
        await campaignService.create(business._id, campaign)

        const scan = userId;
        const res = await api
            .post(`/business/${business.id}/scan/${scan}`)
            .set('Cookie', cookie)
            .expect(200);
        expect(res.body.newRewards.length).toBe(1);
        expect(res.body.newRewards[0].name).toBe(reward.name);
    });

});

afterAll(() => {
    mongoose.connection.close();
});