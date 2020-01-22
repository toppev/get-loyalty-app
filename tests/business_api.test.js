const mongoose = require('mongoose');
const businessService = require('../src/services/businessService');
const Business = require('../src/models/business');
const User = require('../src/models/user');
const app = require('../app');
const api = require('supertest')(app);

const otherBusiness = { email: "example@email.com", public: { address: 'this is an address' } };
let otherBusinessId;
const userParams = { email: "example@email.com", password: "password123" };
let userId;

beforeAll(async () => {
    const url = 'mongodb://127.0.0.1/kantis-business-test';
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    await mongoose.connection.db.dropDatabase();
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
            .set('Accept', 'application/json')
            .set('Cookie', cookie)
            .expect(200);
        business = await businessService.getBusiness(res.body._id);
        expect(business.email).toBe(secondBusinessParam.email);
        const user = await User.findById(userId);
        const index = user.customerData.findIndex(_item => _item.business == res.body._id);
        expect(user.customerData[index].role).toBe('business');
    });

    it('get business public information', async () => {
        const res = await api
            .get(`/business/${otherBusinessId}/public`)
            .set('Accept', 'application/json')
            .set('Cookie', cookie)
            .expect(200);
        expect(res.body.email).toBeUndefined();
        expect(res.body.public.address).toBe(otherBusiness.public.address);
    });

    it('get business self', async () => {
        const res = await api
            .get(`/business/${business.id}`)
            .set('Accept', 'application/json')
            .set('Cookie', cookie)
            .expect(200);
        expect(res.body.email).toBe(business.email);
    });

    it('patch business self', async () => {
        const newEmail = "example2@email.com"
        const res = await api
            .patch(`/business/${business.id}`)
            .set('Accept', 'application/json')
            .set('Cookie', cookie)
            .send({ email: newEmail })
            .expect(200);
        expect(res.body.email).toBe(newEmail);
    });

    it('post business user role change', async () => {
        const res = await api
            .post(`/business/${business.id}/role`)
            .set('Accept', 'application/json')
            .set('Cookie', cookie)
            .send({ userId: userId, role: 'business' })
            .expect(200);
        expect(res.body.role).toBe('business');
        expect(res.body.business).toBe(business.id);
    });

    it('post business user role change to admin', async () => {
        const res = await api
            .post(`/business/${business.id}/role`)
            .set('Accept', 'application/json')
            .set('Cookie', cookie)
            .send({ userId: userId, role: 'admin' })
            .expect(400);
    });

    // Should not have permission to edit other businesses
    it('get business other', async () => {
        await api
            .get(`/business/${otherBusinessId}`)
            .set('Accept', 'application/json')
            .set('Cookie', cookie)
            .expect(403);
    });

    it('patch business other', async () => {
        const newEmail = "example2@email.com"
        await api
            .patch(`/business/${otherBusinessId}`)
            .set('Accept', 'application/json')
            .set('Cookie', cookie)
            .send({ email: newEmail })
            .expect(403);
    });

    it('post business user role change other', async () => {
        await api
            .post(`/business/${otherBusinessId}/role`)
            .set('Accept', 'application/json')
            .set('Cookie', cookie)
            .send({ userId: userId, role: 'business' })
            .expect(403);
    });

});