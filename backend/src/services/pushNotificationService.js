import PushNotification from "../models/pushNotification"
import Business from "../models/business"
import customerService from "../services/customerService"
import webpushService from "../services/webpushService"
import StatusError from "../util/statusError"
import User from "../models/user"
import logger from "../util/logger"

export default {
  addSubscription,
  getPushNotificationHistory,
  sendPushNotification,
  getPushNotificationInfo
}

async function addSubscription(userId, data) {
  const { endpoint, keys } = data
  await customerService.updateCustomer(userId, {
    pushNotifications: {
      endpoint: endpoint,
      auth: keys.auth,
      token: keys.p256dh
    }
  })
}

/**
 * Get notification history, when the cooldown expires and possibly more information
 */
async function getPushNotificationInfo() {

  const notifications = await getPushNotificationHistory()
  const cooldownExpires = await getCooldownExpiration(notifications)
  const usersSubscribed = await getUsersSubscribed()

  return {
    notifications,
    cooldownExpires,
    usersSubscribed
  }
}

async function getPushNotificationHistory() {
  return await PushNotification.find({})
}

/**
 * Returns date when the cooldown expires or undefined if not on cooldown
 * @param notifications the notifications, "sent" field is required for sorting
 */
async function getCooldownExpiration(notifications) {
  const business = await Business.findOne()
  const cooldownMs = business.plan.limits.pushNotificationsCooldownMinutes * 60 * 1000
  if (!notifications.length || cooldownMs <= 0) {
    return
  }
  notifications.sort((a, b) => b.sent - a.sent) // Sort the array, first will be the most recent
  const lastSent = notifications[0].sent.getTime()
  if (lastSent > Date.now() - cooldownMs) {
    const nextMillis = lastSent + cooldownMs
    return new Date(nextMillis)
  }
}

async function sendPushNotification(notificationParam) {
  const business = await Business.findOne()
  const limit = business.plan.limits.pushNotificationsTotal
  const notifications = await getPushNotificationHistory()
  if (limit !== -1 && notifications >= limit) {
    throw new StatusError('Plan limit reached', 402)
  }
  const expires = await getCooldownExpiration(notifications)
  if (expires) {
    throw new StatusError(`You're still on cooldown. You can send next push notification ${expires.toUTCString()}`, 400)
  }
  let users = await User.find({})
  users = users.filter(u => {
    const pn = u.customerData.pushNotifications
    return pn && pn.endpoint // good enough
  })
  const { title, message: body, link } = notificationParam
  // TODO: placeholders?
  const iconURL = `${process.env.PUBLIC_URL}/business/icon`
  const payloadString = JSON.stringify({
    title: title,
    body: body,
    tag: `loyalty-${business.id}`,
    icon: iconURL,
    badge: iconURL,
    data: {
      link
    },
  })

  webpushService.sendNotification(users.map(u => u.customerData.pushNotifications), payloadString).then(res => {
    logger.important('Sent push notification. Result:', JSON.stringify(res))
  })

  const newNotification = new PushNotification({ ...notificationParam, receivers: users.length })
  await newNotification.save()
  const newCooldown = await getCooldownExpiration([newNotification])

  return {
    cooldownExpires: newCooldown,
    notification: newNotification
  }
}

/**
 * Get number of customers who have subscribed to push notifications (enabled them). I.e their web push token exists.
 */
async function getUsersSubscribed() {
  return User.countDocuments({ "customerData.pushNotifications.token": { $ne: null } })
}
