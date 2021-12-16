import userService from "./userService"
import StatusError from "../util/statusError"
import Business from "../models/business"
import customerService from "./customerService"
import campaignService from "./campaignService"
import pollingService from "./pollingService"
import { format } from "../util/stringUtils"
import { asyncFilter } from "../util/asyncFilter"

import logger from "../util/logger"

const POLLING_IDENTIFIERS = pollingService.IDENTIFIERS

// IDs used to identify questions so the actual human-readable question does not matter
const IDENTIFIERS = {
  CONFIRM: 'confirm',
  PRODUCTS: 'products',
  CATEGORIES: 'products',
  REQUIREMENT: function (requirement) {
    return requirement.type
  }
}

/**
 * Parse the scanned string
 * @param scanStr the string to parse, values separated with ":"
 * @return {Promise<{rewardId: string, user: *, userId: string}>}
 */
async function parseScanString(scanStr) {
  const split = scanStr.split(":")
  if (split.length === 0 || split.length > 2) {
    throw new StatusError('Invalid code', 400)
  }
  const userId = split[0]
  const user = await userService.getById(userId)
  if (!user) {
    throw new StatusError('User not found', 404)
  }
  const rewardId = split[1]
  return { user, userId, rewardId }
}

/**
 *
 * @param user the user object or ID of the user. (Required)
 * @param reward the reward or its ID or null/undefined
 * @return string
 */
function toScanCode(user, reward) {
  const userId = user.id || user
  const rewardId = reward.id || reward
  return rewardId ? `${userId}:${rewardId}` : userId
}

/**
 * Validate that the reward exists in the given customerData
 * @param rewardId
 * @param customerData
 */
async function validateRewardId(rewardId, customerData) {
  if (rewardId) {
    // The reward is the entire object, not only the id
    const reward = customerData.rewards.find(r => r._id.equals(rewardId))
    if (!reward) {
      throw new StatusError('Customer selected reward but the reward was not found.')
    }
    return reward
  }
}

/**
 * Get data from the scan
 */
async function getScan(scanStr) {
  const { user, userId, rewardId } = await parseScanString(scanStr)
  const { customerData } = user
  const questions = []

  const userInfo = await customerService.getCustomerInfo(user)
  const reward = await validateRewardId(rewardId, customerData)

  const otherData = {
    user: userInfo,
    reward: reward,
  }

  if (reward) {
    addQuestions(questions, reward.categories, reward.products, [reward.requirement], {
      productQuestion: 'Only these products',
      categoryQuestion: 'Only these categories'
    })
    questions.push({ id: 'success', question: `Use reward "${reward.name}"?`, options: ['Yes', 'No'] })
    otherData.reward = reward
  } else {
    const currentCampaigns = await campaignService.getOnGoingCampaigns(true)
    // Campaigns the user can (possibly) receive. I.e has not received and the campaign limits haven't been reached
    const campaigns = await asyncFilter(currentCampaigns, campaign => {
      return campaignService.canReceiveCampaignRewards(userId, campaign)
        .catch(err => {
          if (err && err.name !== 'StatusError') throw err
        })
    })
    otherData.campaigns = campaigns

    const categories = [].concat(...campaigns.map(c => c.categories))
    const products = [].concat(...campaigns.map(c => c.products))
    const requirements = []

    // Add campaign requirements
    campaigns.map(c => c.requirements).forEach(req => req.question && requirements.push(req))

    addQuestions(questions, categories, products, requirements)

    // Confirmation question
    questions.push({
      id: IDENTIFIERS.CONFIRM,
      question: 'Confirm',
      options: ['Yes', 'No']
    })
  }

  const business = await Business.findOne()
  pollingService.sendToUser(userId, {
    message: business.config.translations.qrScanned.singular,
    refresh: false,
    vibrate: [200]
  }, POLLING_IDENTIFIERS.SCAN)

  return { questions, ...otherData }
}


function addQuestions(questions, categories, products, requirements, options = {}) {
  const { categoryQuestion, productQuestion } = options
  if (categories && categories.length) {
    questions.push({
      id: IDENTIFIERS.CATEGORIES,
      question: categoryQuestion || 'Select categories',
      options: categories.map(c => c.name)
    })
  }
  if (products && products.length) {
    questions.push({
      id: IDENTIFIERS.PRODUCTS,
      question: productQuestion || 'Select products',
      options: products.map(p => p.name)
    })
  }
  if (requirements) {
    requirements.forEach(req => {
      if (!req) return
      const identifier = IDENTIFIERS.REQUIREMENT(req)
      // No duplicate questions
      if (!questions.some(r => r.id === identifier)) {
        questions.push({
          id: identifier,
          question: format(req.question, req.values),
          options: ['Yes', 'No']
        })
      }
    })
  }
}

async function useScan(scanStr, data) {
  const { user, userId, rewardId } = await parseScanString(scanStr)
  const customerData = user.customerData
  const reward = await validateRewardId(rewardId, customerData)
  const business = await Business.findOne()
  const translations = business.config.translations

  let responseMessage

  if (reward) {
    await customerService.useReward(user, customerData, reward)
    responseMessage = translations.rewardUsed.singular
    pollingService.sendToUser(userId, { message: responseMessage, refresh: true }, POLLING_IDENTIFIERS.REWARD_USE)
  }

  // e.g [{ id: "questionId", options: ["someAnswer"], question: "asd?"}]
  const { answers } = data

  const confirmed = answers.find(e => e.id === IDENTIFIERS.CONFIRM)
  if (!confirmed || confirmed?.options?.[0]?.toLowerCase() === "no") {
    const message = `The scan was not confirmed, not adding purchase.`
    logger.info(`${message} (${scanStr})`)
    return { message, newRewards: [], usedRewards: [] }
  }

  const productQuestion = answers.find(e => e.id === IDENTIFIERS.PRODUCTS)
  const products = productQuestion ? productQuestion.options || [] : []

  const categoryQuestion = answers.find(e => e.id === IDENTIFIERS.CATEGORIES)
  const categories = categoryQuestion ? categoryQuestion.options || [] : []

  // Function that returns true if the given requirement/requirement type got truthy answer (from the human/cashier)
  const isTruthyAnswer = (requirement) => {
    const reqId = IDENTIFIERS.REQUIREMENT(requirement.type || requirement)
    const answer = answers.find(e => e.id === reqId)
    // It should just be 'no' or 'yes' but make sure if we change it, it will still work
    return answer && answer.toLowerCase() === 'yes'
  }

  await customerService.addPurchase(userId, { products, categories })

  let newRewards = []
  const campaigns = await campaignService.getOnGoingCampaigns(true)
  for (const campaign of campaigns) {
    // May throw (status)errors, catch them so it won't affect the response status
    try {
      // FIXME: campaign products and categories are ignored
      if (await campaignService.isEligible(user, campaign, isTruthyAnswer)) {
        if (await campaignService.canReceiveCampaignRewards(userId, campaign, isTruthyAnswer)) {
          const rewards = await customerService.addCampaignRewards(user, campaign)
          newRewards.push(...rewards)
        }
        // transactionPoints are always given if the user is eligible for the campaign
        if (campaign.transactionPoints) {
          customerData.properties.points += campaign.transactionPoints
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'StatusError') {
        logger.error(`User not eligible to participate in a campaign because an error occurred`, err)
      }
      // IDEA: should we return reasons why the customer was not eligible?
    }
  }

  // Campaigns may reward with customer points so recalculate customer level and add the customer level
  // rewards (if any) in the new rewards array so the user will be notified of them too
  // FIXME: we are ignoring customer points they may receive from the customer level rewards.
  //  Probably fine to ignore as there's no point rewarding with points when the user reaches X points
  const customerLevel = await customerService.updateCustomerLevel(user, business)
  newRewards.push(...customerLevel.newRewards)

  if (newRewards.length) {
    _sendRewardsMessage(userId, business, newRewards)
  } else {
    pollingService.sendToUser(userId, {
      message: translations.scanRegistered.singular,
      refresh: true
    }, POLLING_IDENTIFIERS.SCAN_GET)
  }
  await user.save() // Save unsaved changes
  return { message: responseMessage, newRewards, usedReward: reward }
}


function _sendRewardsMessage(userId, business, newRewards) {
  const translations = business.config.translations
  const rewardNames = newRewards.map(it => it.name).join(', ')
  const message = format(newRewards.length === 1 ? translations.newReward.singular : translations.newReward.plural, rewardNames)
  pollingService.sendToUser(userId, { message: message, refresh: true }, POLLING_IDENTIFIERS.REWARD_GET)
}


export default {
  getScan,
  useScan,
  toScanCode
}
