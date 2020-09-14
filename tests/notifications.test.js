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
    await new Business().save();
});

const notification = {
    title: 'Test notification',
    message: 'This is a test notification.',
    link: 'https://aaaaaaaa.aaaaa/aaa',
}

it('notification history', async () => {
    await new PushNotification({ ...notification }).save();
    const notification2 = {
        title: 'Test 2',
        message: 'This is a test notification #2',
    }
    await new PushNotification(notification2).save();
    const res = await notificationService.getPushNotificationHistory()
    expect(res.length).toBe(2);
    expect(res[0].title).toBe(notification.title);
    expect(res[0].message).toBe(notification.message);
    expect(res[0].sent).toBeDefined();
});

describe('user can', () => {

    const userParam = { email: 'asdasd@wada.com', password: 'asdasdasddwa' }
    const testNotification = { title: 'Hello world!', message: 'test notification' }
    let userId;
    let cookie;

    beforeAll(async () => {
        // Login
        userId = (await new User(userParam).save()).id;
        const res = await api
            .post('/user/login/local')
            .send(userParam)
            .expect(200);
        await businessService.setUserRole(userId, 'business')
        cookie = res.headers['set-cookie'];

        await PushNotification.collection.drop();
    });

    it('subscribe', async () => {
        const data = {
            keys: {
                auth: 'testauth',
                p256dh: 'testtoken'
            },
            endpoint: 'testendpoint'
        }
        await api
            .post(`/notifications/subscribe`)
            .send(data)
            .set('Cookie', cookie)
            .expect(200)
        const saved = (await User.findById(userId)).customerData.pushNotifications
        expect(saved.token).toBe(data.keys.p256dh)
        expect(saved.auth).toBe(data.keys.auth)
        expect(saved.endpoint).toBe(data.endpoint)
    })

    it('send notification', async () => {
        const res = await api
            .post(`/notifications`)
            .send(testNotification)
            .set('Cookie', cookie)
            .expect(200);
        expect(res.body.cooldownExpires).toBeDefined();
    });


    it('not send notification (cooldown)', async () => {
        const res = await api
            .post(`/notifications`)
            .send(testNotification)
            .set('Cookie', cookie)
            .expect(400);
    });

    it('get notifications', async () => {
        const res = await api
            .get(`/notifications`)
            .set('Cookie', cookie)
            .expect(200);
        expect(res.body.notifications[0].title).toBe(testNotification.title)
    });

})


afterAll(() => {
    closeDatabase();
});