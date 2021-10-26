import businessService from "./businessService"
import _ from "lodash"
import axios from "axios"
import logger from "../util/logger"

const SERVER_KEY = process.env.SERVER_KEY || 'testing'
if (SERVER_KEY === 'testing') logger.info(`Using test SERVER_KEY: ${SERVER_KEY}`)
const USER_PLAN_API = `https://api.getloyalty.app/servers/plan/current?key=${SERVER_KEY}&fallback=default`

export default {
  updateUserPlan
}


async function updateUserPlan() {
  try {
    const owner = await businessService.getBusinessOwnerUser()
    if (!owner) {
      logger.severe("Unable to update plan: no owner found")
      return
    }
    const { email } = owner
    if (!email) {
      logger.severe(`Invalid user email: ${email}`)
      return
    }
    const business = await businessService.getBusiness()
    const plan = await getUserPlan(email)
    if (!plan || plan.error) {
      logger.severe("Requesting current plan returned error.", plan)
    } else if (planHasChanged(business.plan, plan)) {
      business.plan = Object.assign(business.plan, plan)
      await businessService.update(business)
    }
  } catch (err) {
    logger.error("Updating user plan failed: " + err)
  }
}

async function getUserPlan(email) {
  // @ts-ignore
  const res = await axios({
    method: "get",
    url: USER_PLAN_API,
    body: { email: email }
  })
  return res.data
}

/**
 * Returns whether the plans are different (something has changed).
 *
 * Stringifies, parses the JSON and then compares them
 */
function planHasChanged(oldPlan, newPlan) {
  const oldObj = JSON.parse(JSON.stringify(oldPlan))
  const { type, name, limits } = oldObj
  const newObj = JSON.parse(JSON.stringify(newPlan))
  const { type: newType, name: newName, limits: newLimits } = newObj

  if (_.isEqual(limits, newLimits) && type === newType && name === newName) {
    logger.info(`Plans (${name}/${type}) are equal, not updating.`)
    return false
  }
  logger.important("Plan updated from", JSON.stringify(oldObj, null, 2), "to", JSON.stringify(newObj, null, 2))
  return true
}
