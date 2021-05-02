const axios = require("axios")

const BASE_URL = process.env.POLLING_BASE_URL || 'http://localhost:8080/'

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
    console.log(`Failed to poll user`, err)
  })
}


module.exports = {
  sendToUser,
  IDENTIFIERS: POLLING_IDENTIFIERS
}
