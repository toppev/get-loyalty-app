const webpush = require('web-push')

// TODO: add in .env.example
const vapidPublicKey = process.env.VAPID_PUBLIC_KEY
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY
// e.g mailto:email@example.com or a URL
let vapidSubject = process.env.VAPID_CONTACT

if (process.env.NODE_ENV !== 'test') {
  webpush.setVapidDetails(
    vapidSubject,
    vapidPublicKey,
    vapidPrivateKey
  )
}

const options = {
  // 24 hours
  TTL: 24 * 60 * 60,
  // if we want to support legacy browsers
  //gcmAPIKey: '< GCM API Key >',
  vapidDetails: {
    subject: vapidSubject,
    publicKey: vapidPublicKey,
    privateKey: vapidPrivateKey
  }
}

/**
 *
 * @param users One user or an array of users
 * @param payload A valid payload (e.g a string, JSON is not allowed)
 * @returns {Promise<{failed: number, sent: number}>}
 */
async function sendNotification(users, payload) {
  users = Array.isArray(users) ? users : [users]
  let sent = 0
  let failed = 0
  for (const user of users) {
    const pushSubscription = {
      "endpoint": user.endpoint,
      "keys": {
        "p256dh": user.token,
        "auth": user.auth
      }
    }
    try {
      const { statusCode, body } = await webpush.sendNotification(pushSubscription, payload, options)
      if (statusCode === 201) {
        sent++
      } else {
        console.log(`Failed to send a push notification. Received ${statusCode} ${body && body.message}`)
        failed++
      }
    } catch (err) {
      console.log(`Failed to send a push notification. ${err}`)
      failed++
    }
  }

  return {
    sent,
    failed
  }

}

module.exports = {
  sendNotification
}
