import User from "../models/user"
import logger from "../util/logger"

export default {
  addPurchase,
  updateCustomer,
  updateCustomerProperties,
  addReward,
  deleteReward,
  addCampaignRewards,
  getCustomerInfo,
  updateRewards,
  useReward,
  searchCustomers,
  rewardAllCustomers,
  updateCustomerLevel,
  getCurrentLevel,
  checkCustomerLevelExpires
}

/**
 * Get customerData AND other data that is available (e.g email, birthday)
 * @param user the user or the id of the user
 */
async function getCustomerInfo(user) {
  if (!user.customerData) { // Does not exists, the given param is the user id
    user = await User.findById(user)
  }
  const { _id, id, email, customerData, lastVisit, birthday, role, authentication, createdAt } = user
  return {
    _id,
    id,
    email,
    customerData,
    lastVisit,
    birthday,
    role,
    authentication: { service: authentication.service },
    createdAt,
  }
}

/**
 * Update customerData object. Returns the new object.
 * @param userId value of the user's `_id` to query by
 * @param {Object} updated the updates to perform. Values of this object are copied to current object
 */
async function updateCustomer(userId, updated) {
  const user = await User.findById(userId)
  if (!user) throw Error(`User ${userId} was not found`)
  const data = Object.assign(user.customerData, updated)
  await user.save()
  return data
}


/**
 * Update customerData's "properties" object. Returns the new properties object.
 * @param userId value of the user's `_id` to query by
 * @param {Object} updateProperties the updates to perform. Values of this object are copied to current properties.
 */
async function updateCustomerProperties(userId, updateProperties) {
  return await updateCustomer(userId, { properties: updateProperties })
}

/**
 * Add a new purchase. The user's all purchases in the given business.
 * @param userId value of the user's `_id` to query by
 * @param {object} purchase the new purchase
 */
async function addPurchase(userId, purchase) {
  const user = await User.findById(userId)
  if (!user) throw Error(`User ${userId} was not found`)
  user.customerData.purchases.push(purchase)
  await user.save()
  return user.customerData.purchases
}

/**
 * Add a new reward
 * @param userParam the id of the user or the user object, user to receive the reward
 * @param reward the reward to give
 * @param save whether to save the user. Defaults to true
 * @returns {Promise<[*]>} all customer rewards (including the new one)
 */
async function addReward(userParam, reward, save) {
  // For some reason userParam.id is always truthy even if userParam is the id???
  const user = userParam.save ? userParam : await User.findById(userParam)
  let data = user.customerData
  if (reward.customerPoints) {
    data.properties.points += reward.customerPoints
  }
  data.rewards.push(reward)
  if (save !== false) {
    await user.save()
  }
  return data.rewards
}

async function useReward(user, customerData, reward) {
  customerData.rewards = customerData.rewards.filter(r => !r._id.equals(reward._id))
  customerData.usedRewards.push({ reward: reward })
  await user.save()
}

/**
 * A method to replace all rewards.
 * @param userId the id of the user
 * @param newRewards the new rewards to save
 */
async function updateRewards(userId, newRewards) {
  const user = await User.findById(userId)
  if (!user) throw Error(`User ${userId} was not found`)
  const customerData = user.customerData
  customerData.rewards = newRewards
  await user.save()
  return newRewards
}

/**
 * Remove the reward (if given by the specified business) from the user's customer data
 * @param userId the user
 * @param rewardId the reward to remove
 */
async function deleteReward(userId, rewardId) {
  const user = await User.findById(userId)
  if (!user) throw Error(`User ${userId} was not found`)
  const customerData = user.customerData
  const newRewards = customerData.rewards.filter(reward => reward.id.toString() !== rewardId)
  if (newRewards.length !== customerData.rewards.length) {
    customerData.rewards = newRewards
    await user.save()
  }
  return newRewards
}

/**
 * Add all rewards from the campaign.
 * Increases rewardedCount but does not perform any checks, (use #canReceiveCampaignRewards).
 * Does not save the user!
 *
 * @param user the id of the user or the user object
 * @param campaign
 * @returns all given rewards (campaign.endReward)
 */
async function addCampaignRewards(user, campaign) {
  if (campaign.endReward && campaign.endReward.length) {
    for (const reward of campaign.endReward) {
      reward.campaign = campaign.id
      await addReward(user, reward, false)
    }
    campaign.rewardedCount++
    await campaign.save()
  }
  return campaign.endReward
}

function _listCustomers() {
  return User.find().populate(userPopulateSchema)
}

const userPopulateSchema = {
  path: 'customerData',
  populate: [{
    path: 'rewards.categories',
    model: 'Category',
  }, {
    path: 'rewards.products',
    model: 'Product',
  }]
}

async function rewardAllCustomers(reward) {
  const customers = await _listCustomers()
  await Promise.all(customers.map(it => addReward(it, reward, true)))
  return { rewarded: customers.length }
}

/**
 * List customers of the business
 * @param limit maximum number of customers to return, defaults to 100 first if "search" is not specified,
 * otherwise 500. 0 for unlimited
 * @param search the string to search, if no limit is given, only the first 500 will be searched
 */
async function searchCustomers(limit, search = "") {
  // FIXME: this could be a lot better
  const trueLimit = limit === undefined ? (search ? 500 : 100) : limit
  let users = await _listCustomers().limit(Math.max(0, trueLimit))
  if (search?.trim()?.length) {
    users = users.filter(u => JSON.stringify(u).toLowerCase().includes(search))
  }
  return Promise.all(users.map(u => getCustomerInfo(u)))
}

/**
 * Get the current level and give rewards if the user hasn't received them yet.
 * Saves the user if new rewards were given.
 * @param user the user
 * @param business the business
 * @return Promise<{currentLevel, points, newRewards}> currentLevel may be undefined
 */
async function updateCustomerLevel(user, business) {
  const customerData = user.customerData
  const points = customerData.properties.points
  const levels = business.public.customerLevels
  const currentLevel = getCurrentLevel(levels, points)

  const hasReceived = (reward) => {
    return customerData.rewards.some(rew => rew.recognition.equals(reward.recognition)) ||
      customerData.usedRewards.some(kv => kv.reward.recognition.equals(reward.recognition))
  }

  const newRewards = []
  if (currentLevel?.rewards) {
    for (const reward of currentLevel.rewards) {
      if (!hasReceived(reward)) {
        await addReward(user, reward, false)
        newRewards.push(reward)
      }
    }
  }
  if (newRewards.length) {
    user.customerData.customerLevel.since = Date.now()
    await user.save()
  }
  return {
    currentLevel,
    points,
    /** New rewards with original (therefore "wrong" ids) */
    newRewards
  }

}

async function checkCustomerLevelExpires(user, business) {
  const levels = business.public.customerLevels
  const currentPoints = user.customerData.properties.points
  const currentLevel = getCurrentLevel(levels, currentPoints)
  const { pointsFee } = currentLevel
  const levelReachedMillis = user.customerData.customerLevel.since.getTime() || 0
  const toStayPeriodMillis = pointsFee.period

  if (toStayPeriodMillis && Date.now() - levelReachedMillis > toStayPeriodMillis) {
    if (pointsFee.points > 0) {
      const newPoints = currentPoints - pointsFee.points
      user.customerData.properties.points = newPoints
      user.customerData.customerLevel.since = Date.now()
      await user.save()

      logger.info(`User ${user.id} / ${user.email} customer level downgraded`, JSON.stringify({
        previousPoints: currentPoints,
        newPoints,
        previousLevel: currentLevel?.name,
        newLevel: getCurrentLevel(levels, newPoints)?.name,
      }))
    }
  }

}

/**
 *
 * @return {any}
 */
function getCurrentLevel(levels, points) {
  let currentLevel = undefined
  levels.forEach(lvl => {
    if (points >= lvl.requiredPoints && (!currentLevel || lvl.requiredPoints > currentLevel.requiredPoints)) {
      currentLevel = lvl
    }
  })
  return currentLevel
}
