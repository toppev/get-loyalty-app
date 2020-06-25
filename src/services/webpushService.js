const webpush = require('web-push');

// TODO: add in .env.example
const vapidPublicKey = process.env.VAPID_PUBLIC_KEY
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY
// e.g mailto:email@example.com
let vapidMailto = process.env.VAPID_SUBJECT

if (process.env.NODE_ENV !== 'test') {
    webpush.setVapidDetails(
        vapidMailto,
        vapidPublicKey,
        vapidPrivateKey
    );
}

const options = {
    // 24 hours
    TTL: 24 * 60 * 60,
    // if we want to support legacy browsers
    //gcmAPIKey: '< GCM API Key >',
    vapidDetails: {
        subject: vapidMailto,
        publicKey: vapidPublicKey,
        privateKey: vapidPrivateKey
    }
};

async function sendNotification(users, payload) {
    users = Array.isArray(users) ? users : [users]
    let sent = 0
    let failed = 0
    for (const user of users) {
        let pushSubscription = {
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