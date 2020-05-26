const PushNotification = require('../models/pushNotification');

module.exports = {
    getPushNotificationHistory,
    sendPushNotification
}

async function getPushNotificationHistory(businessId) {
    return await PushNotification.find({ business: businessId });
}

async function sendPushNotification(businessId, notificationParam) {
    const newNotification = new PushNotification(notificationParam);
    newNotification.business = businessId;
    await newNotification.save();
    // TODO: send the notification and return some data
}
