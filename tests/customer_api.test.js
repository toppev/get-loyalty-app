const { initDatabase, closeDatabase } = require('./testUtils');
const businessService = require('../src/services/businessService');
const User = require('../src/models/user');
const app = require('../app');
const api = require('supertest')(app);

const businessParam = { email: "customer.test.business@email.com", public: { address: 'this is an address' } };
const userParams = { email: "customer.test@email.com", password: "password123" };

let cookie;
let userId;

beforeAll(async () => {
    await initDatabase('customer');
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
    await businessService.getBusiness();
});

describe('Logged in user with permissions can modify customer rewards', () => {

    let firstReward = { name: 'first coupon!', itemDiscount: '20% OFF' };
    let secondReward = { name: 'a new coupon!', itemDiscount: 'Free coffee!' };

    it('add reward', async () => {
        const res = await api
            .post(`/customer/${userId}/reward`)
            .send(firstReward)
            .set('Cookie', cookie)
            .expect(200);
        expect(res.body.rewards[0].name).toBe(firstReward.name)
        // eslint-disable-next-line require-atomic-updates
        firstReward._id = res.body.rewards[0]._id;
    });

    it('add second reward', async () => {
        const res = await api
            .post(`/customer/${userId}/reward`)
            .send(secondReward)
            .set('Cookie', cookie)
            .expect(200);
        const resRewards = res.body.rewards;
        expect(resRewards.length).toBe(2);
        expect(resRewards[0]._id).toBe(firstReward._id);
        expect(resRewards[1].name).toBe(secondReward.name);
    });


    it('delete first reward', async () => {
        const res = await api
            .delete(`/customer/${userId}/reward/${firstReward._id}`)
            .set('Cookie', cookie)
            .expect(200);
        expect(res.body.rewards.length).toBe(1)
        expect(res.body.rewards[0].name).toBe(secondReward.name);
    });

    it('update rewards', async () => {
        const res = await api
            .post(`/customer/${userId}/rewards`)
            .send([firstReward])
            .set('Cookie', cookie)
            .expect(200);
        expect(res.body.rewards.length).toBe(1)
        expect(res.body.rewards[0].name).toBe(firstReward.name)
    });

});

describe('Logged in user with permissions can modify customer data', () => {

    it('get customer', async () => {
        const res = await api
            .get(`/customer/${userId}`)
            .set('Cookie', cookie)
            .expect(200);
        expect(res.body.customerData.id).toBe(userId.toString())
    });

    it('update customer points (properties)', async () => {
        const data = {
            points: 100
        };
        const res = await api
            .patch(`/customer/${userId}/properties`)
            .send(data)
            .set('Cookie', cookie)
            .expect(200);
        expect(res.body.properties.points).toBe(data.points);
    });
});

afterAll(() => {
    closeDatabase();
});