const businessService = require('./businessService')
const _ = require('lodash')
const axios = require("axios")

const SERVER_KEY = process.env.SERVER_KEY || 'testing'
if (SERVER_KEY === 'testing') console.log(`Using test SERVER_KEY: ${SERVER_KEY}`)
const USER_PLAN_API = `https://api.getloyalty.app/servers/plan/current?key=${SERVER_KEY}&fallback=default`

module.exports = {
  updateUserPlan
}


async function updateUserPlan() {
  try {
    const owner = await businessService.getBusinessOwnerUser()
    if (!owner) {
      console.log("Unable to update plan: no owner found")
      return
    }
    const { email } = owner
    if (!email) {
      console.log(`Invalid user email: ${email}`)
      return
    }
    const business = await businessService.getBusiness()
    const plan = await getUserPlan(email)
    if (!plan || plan.error) {
      console.log("Requesting current plan returned error.", plan)
    } else if (planHasChanged(business.plan, plan)) {
      business.plan = Object.assign(business.plan, plan)
      await businessService.update(business)
    }
  } catch (err) {
    console.log("Updating user plan failed: " + err)
  }
}

async function getUserPlan(email) {
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
  // eslint-disable-next-line no-unused-vars
  const { _id, ...oldObj } = JSON.parse(JSON.stringify(oldPlan))
  // eslint-disable-next-line no-unused-vars
  const { id, ...newObj } = JSON.parse(JSON.stringify(newPlan))
  if (_.isEqual(oldObj, newObj)) {
    console.log(`Plans (${newObj.name}/${newObj.type}) are equal, not updating.`)
    return false
  }
  console.log("Plan updated from", oldObj, "to", newObj)
  return true
}
