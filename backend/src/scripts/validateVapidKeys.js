/**
 * Simple script to debug valid key issues
 */

import webpush from "web-push/src/vapid-helper.js"
import readlineSync from "readline-sync"

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
