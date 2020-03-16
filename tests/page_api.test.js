const mongoose = require('mongoose');
const pageService = require('../src/services/pageService');
const businessService = require('../src/services/businessService');
const User = require('../src/models/user');
const app = require('../app');
const api = require('supertest')(app);

const businessParams = { email: "example@email.com", public: { address: 'this is an address' } };
const userParams = { email: "example@email.com", password: "password123" };
let userId;

const testPageData = { gjs: { "gjs-components": ["stuff"], "gjs-style": ["more stuff"] } }
const updatedPageData = { gjs: { "gjs-components": ["differentStuff"], "gjs-style": ["more stuff"] } }

beforeAll(async () => {
    const url = 'mongodb://127.0.0.1/kantis-page-test';
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    await mongoose.connection.db.dropDatabase();
});

describe('Logged in user with permissions can', () => {

    let cookie;
    let businessId;

    beforeAll(async () => {
        // Login
        userId = (await new User(userParams).save())._id;
        const res = await api
            .post('/user/login/local')
            .send(userParams)
            .expect(200);
        // Setting the cookie
        cookie = res.headers['set-cookie'];
        businessId = (await businessService.createBusiness(businessParams, userId)).id;
    });

    it('save page', async () => {
        const res = await api
            .post(`/business/${businessId}/page`)
            .set('Cookie', cookie)
            .send(testPageData)
            .expect(200);
        const resId = res.body._id;
        expect(resId).toBeDefined();
        testPageData.id = resId;
    });

    it('update page', async () => {
        const res = await api
            .post(`/business/${businessId}/page/${testPageData.id}`)
            .set('Cookie', cookie)
            .send(updatedPageData)
            .expect(200);
    });

    it('get page', async () => {
        const res = await api
            .get(`/business/${businessId}/page/${testPageData.id}`)
            .set('Cookie', cookie)
            .expect(200);
        expect(res.body.gjs).toStrictEqual(updatedPageData.gjs);
    });

    it('list pages', async () => {
        const res = await api
            .get(`/business/${businessId}/page/list`)
            .set('Cookie', cookie)
            .expect(200);
        expect(res.body[0].gjs).toBeFalsy();
        expect(res.body[0]._id).toBeTruthy();
    });

});

afterAll(() => {
    mongoose.connection.close();
});