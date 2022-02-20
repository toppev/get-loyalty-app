import userService from "./userService"
import StatusError from "../util/statusError"
import Business from "../models/business"
import customerService from "./customerService"
import campaignService from "./campaignService"
import pollingService from "./pollingService"
import couponService from "./couponService"
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


// TODO: make it support multiple reward/coupon uses at once

async function fromScanCode(scanStr) {
  const { user: userId, reward: rewardId, coupon: couponId } = JSON.parse(scanStr)
  const user = await userService.getById(userId)
  if (!user) throw new StatusError('User not found', 404)
  return { user, userId, rewardId, couponId }
}

function toScanCode(user, reward, coupon) {
  console.log({user, reward, coupon})
  const data = {
    user: user._id || user,
    ...(reward && { reward: reward._id || reward }),
    ...(coupon && { coupon: coupon._id || coupon }),
  }
  console.log({data})
  return JSON.stringify(data)
}

/**
 * Validate that the reward exists in the given customerData
 */
async function validateReward(rewardId, customerData) {
  if (rewardId) {
    // The reward is the entire object, not only the id
    const reward = customerData.rewards.find(r => r._id.equals(rewardId))
    if (!reward) throw new StatusError('A reward selected by the customer was not found.')
    if (reward.expires && new Date(reward.expires).getTime() < Date.now()) {
      throw new StatusError(`The reward expired (${new Date(reward.expires).toUTCString()}). You can still let them use it (without the loyalty app).`)
    }
    return reward
  }
}

async function validateCoupon(couponId, customerData) {
  if (couponId) {
    // The coupon is the entire object, not only the id
    const coupon = customerData.coupons.find(c => c.coupon._id.equals(couponId))
    if (!coupon) throw new StatusError('A coupon selected by the customer was not found.')
    if (coupon.expires && new Date(coupon.expires).getTime() < Date.now()) {
      throw new StatusError(`The coupon expired (${new Date(coupon.expires).toUTCString()}). You can still let them use it (without the loyalty app).`)
    }
    return coupon
  }
}

/**
 * Get data from the scan
 */
async function getScanInfo(scanStr) {
  const { user, userId, rewardId, couponId } = await fromScanCode(scanStr)
  const { customerData } = user
  const questions = []

  const userInfo = await customerService.getCustomerInfo(user)
  const reward = await validateReward(rewardId, customerData)
  const coupon = await validateCoupon(couponId, customerData)

  const response = {
    user: userInfo,
    reward: reward,
    coupon: coupon,
  }

  if (reward) {
    addQuestions(questions, reward.categories, reward.products, [reward.requirement], {
      productQuestion: 'Reward only applies to these products',
      categoryQuestion: 'Reward only applies to these categories'
    })
    questions.push({ id: 'success', question: `Use reward "${reward.name}"?`, options: ['Yes', 'No'] })
  } else if (coupon) {
    addQuestions(questions, coupon.categories, coupon.products, [], {
      productQuestion: 'Coupon only applies to these products',
      categoryQuestion: 'Coupon only applies to these categories'
    })
    questions.push({ id: 'success', question: `Use coupon "${coupon.coupon.reward.name}"?`, options: ['Yes', 'No'] })
  } else {
    const currentCampaigns = await campaignService.getOnGoingCampaigns(true)
    // Campaigns the user can (possibly) receive. I.e has not received and the campaign limits haven't been reached
    const campaigns = await asyncFilter(currentCampaigns, campaign => {
      return campaignService.canReceiveCampaignRewards(userId, campaign)
        .catch(err => {
          if (err && err.name !== 'StatusError') throw err
        })
    })
    response.campaigns = campaigns

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

  return { questions, ...response }
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
  const { user, userId, rewardId, couponId } = await fromScanCode(scanStr)
  const customerData = user.customerData
  const business = await Business.findOne()
  const translations = business.config.translations

  const reward = await validateReward(rewardId, customerData)
  const coupon = await validateCoupon(couponId, customerData)

  // e.g [{ id: "questionId", options: ["someAnswer"], question: "asd?"}]
  const { answers } = data

  const confirmed = answers.find(e => e.id === IDENTIFIERS.CONFIRM)
  if (!confirmed || confirmed?.options?.[0]?.toLowerCase() === "no") {
    const message = `The scan was not confirmed, not adding purchase.`
    logger.info(`${message} (${scanStr})`)
    pollingService.sendToUser(userId, { message: "The reward was declined.", refresh: true }, POLLING_IDENTIFIERS.REWARD_USE)
    return { message, newRewards: [], usedRewards: [] }
  }

  let responseMessage
  const newRewards = []

  if (reward) {
    await customerService.useReward(user, customerData, reward)
    responseMessage = translations.rewardUsed.singular
    pollingService.sendToUser(userId, { message: responseMessage, refresh: true }, POLLING_IDENTIFIERS.REWARD_USE)
  }
  if (coupon) {
    await couponService.useCoupon(user, coupon.id)
  } else {

    const products = answers.find(e => e.id === IDENTIFIERS.PRODUCTS)?.options || []
    const categories = answers.find(e => e.id === IDENTIFIERS.CATEGORIES)?.options || []

    // Function that returns true if the given requirement/requirement type got truthy answer (from the human/cashier)
    const isTruthyAnswer = (requirement) => {
      const reqId = IDENTIFIERS.REQUIREMENT(requirement.type || requirement)
      const answer = answers.find(e => e.id === reqId)
      // It should just be 'no' or 'yes' but make sure if we change it, it will still work
      return answer && answer.toLowerCase() === 'yes'
    }

    await customerService.addPurchase(userId, { products, categories })
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
  }

  await user.save() // Save unsaved changes
  return {
    message: responseMessage,
    newRewards,
    usedRewards: [reward, coupon?.reward].filter(Boolean)
  }
}


function _sendRewardsMessage(userId, business, newRewards) {
  const translations = business.config.translations
  const rewardNames = newRewards.map(it => it.name).join(', ')
  const message = format(newRewards.length === 1 ? translations.newReward.singular : translations.newReward.plural, [rewardNames])
  pollingService.sendToUser(userId, { message: message, refresh: true }, POLLING_IDENTIFIERS.REWARD_GET)
}


export default {
  getScanInfo,
  useScan,
  toScanCode
}
