const { initDatabase, closeDatabase } = require('./testUtils');
const PushNotification = require('../src/models/pushNotification');
const Business = require('../src/models/business');
const User = require('../src/models/user');
const notificationService = require('../src/services/pushNotificationService');
const businessService = require('../src/services/businessService');
const app = require('../app');
const api = require('supertest')(app);

beforeAll(async () => {
    await initDatabase('notification');
});

const notification = {
    title: 'Test notification',
    message: 'This is a test notification.',
    link: 'https://aaaaaaaa.aaaaa/aaa',
}

it('notification history', async () => {
    const business = await new Business({}).save();
    await new PushNotification({ ...notification, business: business._id }).save();
    const notification2 = {
        title: 'Test 2',
        message: 'This is a test notification #2',
        business: business._id
    }
    await new PushNotification(notification2).save();
    const res = await notificationService.getPushNotificationHistory(business._id)
    expect(res.length).toBe(2);
    expect(res[0].title).toBe(notification.title);
    expect(res[0].message).toBe(notification.message);
    expect(res[0].sent).toBeDefined();
});

it('send notification', async () => {
    const business = await new Business({}).save();
    const businessId = business._id;
    const newNotification = { ...notification, business: businessId };
    await notificationService.sendPushNotification(businessId, newNotification);
    const res = await PushNotification.find({ business: businessId })
    expect(res.length).toBe(1);
});

describe('user can', () => {

    const userParam = { email: 'asdasd@wada.com', password: 'asdasdasddwa' }
    const testNotification = { title: 'Hello world!', message: 'test notification' }
    let userId;
    let cookie;
    let business;

    beforeAll(async () => {
        // Login
        userId = (await new User(userParam).save())._id;
        const res = await api
            .post('/user/login/local')
            .send(userParam)
            .expect(200);
        business = await businessService.createBusiness({}, userId)
        cookie = res.headers['set-cookie'];
    });

    it('subscribe', async () => {
        const data = {
            token: 'testtoken',
            auth: 'testauth',
            endpoint: 'testendpoint'
        }
        await api
            .post(`/business/${business.id}/notifications/subscribe`)
            .send(data)
            .set('Cookie', cookie)
            .expect(200)
        const saved = (await User.findById(userId)).customerData[0].pushNotifications
        expect(saved.token).toBe(data.token)
        expect(saved.auth).toBe(data.auth)
        expect(saved.endpoint).toBe(data.endpoint)
    })

    it('send notification', async () => {
        const res = await api
            .post(`/business/${business.id}/notifications`)
            .send(testNotification)
            .set('Cookie', cookie)
            .expect(200);
        expect(res.body.result.failed).toEqual(1);
        expect(res.body.cooldownExpires).toBeDefined();
    });

    it('get notifications', async () => {
        const res = await api
            .get(`/business/${business.id}/notifications`)
            .set('Cookie', cookie)
            .expect(200);
        expect(res.body.notifications[0].title).toBe(testNotification.title)
    });

})


afterAll(() => {
    closeDatabase();
});