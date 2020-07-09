const fs = require('fs');
const businessService = require('../src/services/businessService');
const campaignService = require('../src/services/campaignService');
const Business = require('../src/models/business');
const User = require('../src/models/user');
const app = require('../app');
const api = require('supertest')(app);
const { initDatabase, closeDatabase, deleteUploadsDirectory } = require('./testUtils');

const userParams = { email: "example@email.com", password: "password123" };
let userId;
const testReward = { name: 'Test reward #123151', itemDiscount: 'free' }

beforeAll(async () => {
    await initDatabase('business');
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
        const businessParam = { email: 'example2@email.com' }
        const res = await api
            .post('/business/create')
            .send(businessParam)
            .set('Cookie', cookie)
            .expect(200);
        business = await businessService.getBusiness(res.body._id);
        expect(business.email).toBe(businessParam.email);
        const user = await User.findById(userId);
        expect(user.role).toBe('business');
    });

    it('get business public information', async () => {
        const tempUserCredentials = { email: "example1231@email.com", password: "password123" };
        await new User(tempUserCredentials).save();
        const res = await api
            .post('/user/login/local')
            .send(tempUserCredentials);
        // Setting the cookie
        let tempCookie = res.headers['set-cookie'];
        const publicReq = await api
            .get(`/business/${business.id}/public`)
            .set('Cookie', tempCookie)
            .expect(200);
        expect(publicReq.body.email).toBeUndefined();
        expect(publicReq.body.public.address).toBe(business.public.address);
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
        expect(res.body.rewarded).toBe(2)
        const rewardedUser = await User.findById(userId)
        expect(rewardedUser.customerData.rewards[0].name).toEqual(testReward.name)
    })


    it('get customers', async () => {
        const res = await api
            .get(`/business/${business.id}/customers`)
            .set('Cookie', cookie)
            .expect(200)
        expect(res.body.customers.length).toBe(2);
        expect(res.body.customers[0].email).toBe(userParams.email);
        expect(res.body.customers[0].customerData.rewards.length).toBe(1);
        expect(res.body.customers[0].customerData.rewards[0].name).toBe(testReward.name);
    })

    it('upload icon', async () => {
        await api
            .post(`/business/${business.id}/icon`)
            .type('multipart/form-data')
            .attach('file', 'testresources/favicon.ico')
            .set('Cookie', cookie)
            .expect(200)
    })

    it('get icon', async () => {
        const res = await api
            .get(`/business/${business.id}/icon`)
            .set('Cookie', cookie)
            .expect(200)

        expect(res.headers['content-type']).toBe('image/x-icon')

        const buf = await fs.promises.readFile('testresources/favicon.ico')
        expect(res.body).toEqual(buf);

    })

});

afterAll(() => {
    closeDatabase();
    deleteUploadsDirectory(1)
});