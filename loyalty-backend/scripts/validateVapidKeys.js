/**
 * Simple script to debug valid key issues
 */

// Kinda tricky but works, the module does not export the validation functions
const webpush = require('../node_modules/web-push/src/vapid-helper.js');
const readlineSync = require('readline-sync');

const publicKey = readlineSync.question('Public key to validate: ')
try {
    console.log(publicKey.length)
    webpush.validatePublicKey(publicKey)
    console.log("Public key validated.")
} catch (err) {
    console.log(err)
}

const privateKey = readlineSync.question('Private key to validate: ')
try {
    console.log(privateKey.length)
    webpush.validatePrivateKey(privateKey)
    console.log("Private key validated.")
} catch (err) {
    console.log(err)
}
