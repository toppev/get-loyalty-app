import axios from "axios"
import User from "../models/user"
import logger from "../util/logger"

let BASE_URL = process.env.POLLING_BASE_URL || 'http://localhost:8080'
if (BASE_URL.endsWith("/")) BASE_URL = BASE_URL.slice(0, -1)

const IDENTIFIERS = {
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
  if (!owner) throw Error("No owner found to refresh demo view")
  sendToUser(owner.id, {
    message: message,
    refresh: true,
    duration: 1000
  }, IDENTIFIERS.OTHER)
}

export default {
  sendToUser,
  refreshOwner,
  IDENTIFIERS
}
