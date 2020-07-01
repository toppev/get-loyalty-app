const businessService = require('../src/services/businessService');
const campaignService = require('../src/services/campaignService');
const Business = require('../src/models/business');
const User = require('../src/models/user');
const app = require('../app');
const api = require('supertest')(app);
const { initDatabase, closeDatabase } = require('./testUtils');

const otherBusiness = { email: "example@email.com", public: { address: 'this is an address' } };
let otherBusinessId;
const userParams = { email: "example@email.com", password: "password123" };
let userId;
const testReward = { name: 'Test reward #123151', itemDiscount: 'free' }

beforeAll(async () => {
    await initDatabase('business');
    otherBusinessId = (await new Business(otherBusiness).save())._id;
});

describe('Logged in user can', () => {

    let cookie;
    let business;

    beforeAll(async () => {
        // Login
        userId = (await new User(userParams).save())._id;
        const res = await api
            .post('/user/login/local')
            .send(userParams)
            .expect(200);
        // Setting the cookie
        cookie = res.headers['set-cookie'];
    });

    it('create business', async () => {
        const secondBusinessParam = { email: 'example2@email.com' }
        const res = await api
            .post('/business/create')
            .send(secondBusinessParam)
            .set('Cookie', cookie)
            .expect(200);
        business = await businessService.getBusiness(res.body._id);
        expect(business.email).toBe(secondBusinessParam.email);
        const user = await User.findById(userId);
        const index = user.customerData.findIndex(_item => _item.business.equals(res.body._id));
        expect(user.customerData[index].role).toBe('business');
    });

    it('get business public information', async () => {
        const res = await api
            .get(`/business/${otherBusinessId}/public`)
            .set('Cookie', cookie)
            .expect(200);
        expect(res.body.email).toBeUndefined();
        expect(res.body.public.address).toBe(otherBusiness.public.address);
    });

    it('get business self', async () => {
        const res = await api
            .get(`/business/${business.id}`)
            .set('Cookie', cookie)
            .expect(200);
        expect(res.body.email).toBe(business.email);
    });

    it('patch business self', async () => {
        const newEmail = "example2@email.com"
        const res = await api
            .patch(`/business/${business.id}`)
            .set('Cookie', cookie)
            .send({ email: newEmail })
            .expect(200);
        expect(res.body.email).toBe(newEmail);
    });

    it('post business user role change', async () => {
        const res = await api
            .post(`/business/${business.id}/role`)
            .set('Cookie', cookie)
            .send({ userId: userId, role: 'business' })
            .expect(200);
        expect(res.body.role).toBe('business');
        expect(res.body.business).toBe(business.id);
    });

    it('post business user role change to admin', async () => {
        const res = await api
            .post(`/business/${business.id}/role`)
            .set('Cookie', cookie)
            .send({ userId: userId, role: 'admin' })
            .expect(400);
    });

    // Should not have permission to edit other businesses
    it('get business other', async () => {
        await api
            .get(`/business/${otherBusinessId}`)
            .set('Cookie', cookie)
            .expect(403);
    });

    it('patch business other', async () => {
        const newEmail = "example2@email.com"
        await api
            .patch(`/business/${otherBusinessId}`)
            .set('Cookie', cookie)
            .send({ email: newEmail })
            .expect(403);
    });

    it('post business user role change other', async () => {
        await api
            .post(`/business/${otherBusinessId}/role`)
            .set('Cookie', cookie)
            .send({ userId: userId, role: 'business' })
            .expect(403);
    });

    it('list rewards', async () => {
        await campaignService.create(business.id, {
            name: 'dasdawdasd',
            endReward: [{ name: 'free stuff', itemDiscount: 'free' }]
        });
        const res = await api
            .get(`/business/${business.id}/reward/list`)
            .set('Cookie', cookie)
            .expect(200)
        expect(res.body.length).toBe(1);
        expect(res.body[0].name).toBe('free stuff');
    })

    it('reward all', async () => {
        const res = await api
            .post(`/business/${business.id}/reward/all`)
            .send(testReward)
            .set('Cookie', cookie)
            .expect(200)
        expect(res.body.rewarded).toBe(1)
        const rewardedUser = await User.findById(userId)
        expect(rewardedUser.customerData[0].rewards[0].name).toEqual(testReward.name)
    })


    it('get customers', async () => {
        const res = await api
            .get(`/business/${business.id}/customers`)
            .set('Cookie', cookie)
            .expect(200)
        expect(res.body.customers.length).toBe(1);
        expect(res.body.customers[0].email).toBe(userParams.email);
        expect(res.body.customers[0].customerData.rewards.length).toBe(1);
        expect(res.body.customers[0].customerData.rewards[0].name).toBe(testReward.name);
    })

});

afterAll(() => {
    closeDatabase();
});