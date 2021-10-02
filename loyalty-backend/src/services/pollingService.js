const axios = require("axios")
const User = require("../models/user")
const logger = require("../util/logger")

let BASE_URL = process.env.POLLING_BASE_URL || 'http://localhost:8080'
if (BASE_URL.endsWith("/")) BASE_URL = BASE_URL.slice(0, -1)

const POLLING_IDENTIFIERS = {
  SCAN: 'scan',
  REWARD_GET: 'reward_get',
  SCAN_GET: 'scan_get',
  REWARD_USE: 'reward_use',
  OTHER: 'other'
}

function sendToUser(userId, data, type = '') {
  const testing = process.env.NODE_ENV === 'test'
  if (testing) return
  const id = `${type}_${userId}`
  axios.post(`${BASE_URL}/${id}/send`, data, {
    headers: {
      'Polling-Authentication': process.env.POLLING_AUTHENTICATION
    }
  }).catch(err => {
    logger.error(`Failed to poll user:`, err.message)
    logger.debug(err)
  })
}

async function refreshOwner({ message }) {
  const owner = await User.findOne({ role: 'business' })
  sendToUser(owner.id, {
    message: message,
    refresh: true,
    duration: 1000
  }, POLLING_IDENTIFIERS.OTHER)
}

module.exports = {
  sendToUser,
  refreshOwner,
  IDENTIFIERS: POLLING_IDENTIFIERS
}
