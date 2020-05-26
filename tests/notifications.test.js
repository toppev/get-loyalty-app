const mongoose = require('mongoose');
const PushNotification = require('../src/models/pushNotification');
const business = require('../src/models/business');

beforeAll(async () => {
    const url = 'mongodb://127.0.0.1/kantis-role-test'
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    await mongoose.connection.db.dropDatabase();
});


it('notification history', async () => {
    const notification = {
        name: 'Test notification',
        message: 'This is a test notification.',
        link: 'https://aaaaaaaa.aaaaa/aaa'
    }
    await new Business({}).save();
    await new PushNotification(notification).save();

    notificationService.getPushNotificationHistory()
})