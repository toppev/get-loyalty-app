const PushNotification = require('../models/pushNotification');
const Business = require('../models/business');
const StatusError = require('../helpers/statusError');

module.exports = {
    getPushNotificationHistory,
    sendPushNotification,
    getPushNotificationInfo
}

/**
 * Get notification history, when the cooldown expires and possibly more information
 */
async function getPushNotificationInfo(businessId) {
    const business = await Business.findById(businessId);
    const notifications = await getPushNotificationHistory(business);
    const cooldownExpires = await getCooldownExpiration(business, notifications);
    return {
        notifications,
        cooldownExpires
    }
}

async function getPushNotificationHistory(businessId) {
    return await PushNotification.find({ business: businessId });
}

/**
 * Returns date when the cooldown expires or undefined if not on cooldown
 * @param business the business
 * @param notifications the notifications, "sent" field is required for sorting
 */
async function getCooldownExpiration(business, notifications) {
    const cooldownMs = business.plan.limits.pushNotifications.cooldownMinutes * 60 * 1000;
    if (!notifications.length || cooldownMs <= 0) {
        return
    }
    notifications.sort((a, b) => b.sent - a.sent); // Sort the array, first will be the most recent
    const lastSent = notifications[0].sent.getTime();
    if (lastSent > Date.now() - cooldownMs) {
        const nextMillis = lastSent + cooldownMs;
        return new Date(nextMillis)
    }
}

async function sendPushNotification(businessId, notificationParam) {
    const business = await Business.findById(businessId);
    const limit = business.plan.limits.pushNotifications.total;
    const notifications = await getPushNotificationHistory(businessId)
    if (limit !== -1 && notifications >= limit) {
        throw new StatusError('Plan limit reached', 402)
    }
    const expires = await getCooldownExpiration(business, notifications);
    if (expires) {
        throw new StatusError(`You're on still cooldown. You can send next push notification ${expires.toUTCString()}`, 400);
    }
    let receivers = 0;
    // TODO: send the actual push notification

    const newNotification = new PushNotification({...notificationParam, receivers});
    newNotification.business = businessId;
    await newNotification.save();
    const newCooldown = await getCooldownExpiration(business, [newNotification]);
    return {
        cooldownExpires: newCooldown,
        notification: newNotification
    }
}
