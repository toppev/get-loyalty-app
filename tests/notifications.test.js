const { initDatabase, closeDatabase } = require('./testUtils');
const PushNotification = require('../src/models/pushNotification');
const Business = require('../src/models/business');
const notificationService = require('../src/services/pushNotificationService');


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


afterAll(() => {
    closeDatabase();
});