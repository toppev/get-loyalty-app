/**
 *  Generate new vapid public and private keys
 *
 *  Run with "node scripts/vapid.js"
 */

const webpush = require('web-push');

const vapidKeys = webpush.generateVAPIDKeys()

console.log(`VAPID_PUBLIC_KEY=${vapidKeys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${vapidKeys.privateKey}`);