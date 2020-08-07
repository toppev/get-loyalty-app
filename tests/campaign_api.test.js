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
    await initDatabase('campaign');
});

describe('Logged in user with permissions can', () => {

    let cookie;
    let campaignId;

    beforeAll(async () => {
        // Login
        userId = (await new User(userParams).save())._id;
        const res = await api
            .post('/user/login/local')
            .send(userParams)
            .expect(200);
        // Setting the cookie
        cookie = res.headers['set-cookie'];
        await businessService.createBusiness(businessParams, userId)
    });

    it('create campaign', async () => {
        const testCategory = await categoryService.create({ name: 'test category' })
        const campaignParam = { name: "Test Campaign", categories: [testCategory] }
        const res = await api
            .post(`/campaign`)
            .set('Cookie', cookie)
            .send(campaignParam)
            .expect(200);
        campaignId = res.body._id;
        expect(res.body.name).toBe(campaignParam.name);
    });

    it('update campaign', async () => {
        const newData = { name: "Test Campaign2" }
        const res = await api
            .patch(`/campaign/${campaignId}`)
            .set('Cookie', cookie)
            .send(newData)
            .expect(200);
        expect(res.body.name).toBe(newData.name);
    });

    it('get campaign', async () => {
        const res = await api
            .get(`/campaign/${campaignId}`)
            .set('Cookie', cookie)
            .expect(200);
        expect(res.body._id).toBe(campaignId);
        expect(res.body.categories[0].name).toBe('test category');
    });

    it('get all', async () => {
        const res = await api
            .get(`/campaign/all`)
            .set('Cookie', cookie)
            .expect(200);
        expect(res.body[0]._id).toBe(campaignId);
        expect(res.body[0].categories[0].name).toBe('test category');
    });


    it('delete campaign', async () => {
        await api
            .delete(`/campaign/${campaignId}`)
            .set('Cookie', cookie)
            .expect(200);
    });

});

afterAll(() => {
    closeDatabase();
});