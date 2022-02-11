/**
 * This is a controller handles when a customer scans a coupon QR code.
 */
import { Router } from "express"
import customerService from "../../services/customerService"
import campaignService from "../../services/campaignService"
import User from "../../models/user"
import StatusError from "../../util/statusError"
import campaignTypes from "@toppev/getloyalty-campaigns"
import logger from "../../util/logger"

const router = Router()
// Claim a coupon reward
// Simple coupon: /coupon/<coupon>
// or referral: /coupon/referral?referrer=<userId>
router.post('/:coupon', getCoupon)

export default router

async function getCoupon(req, res, next) {
  try {
    const { coupon } = req.params
    const userId = req.user.id
    const referrer = req.query.referrer
    const campaign = await campaignService.byCouponCode(coupon)
    if (!campaign) {
      throw new StatusError(`Coupon ${coupon} not found`, 404)
    } else {
      if (await campaignService.canReceiveCampaignRewards(userId, campaign)) {
        const user = await User.findById(userId)
        if (!user) throw Error(`User ${userId} was not found`)
        let rewards
        if (referrer) {
          rewards = (await handleReferralCode(user, campaign, referrer)).userRewards
        } else {
          rewards = await customerService.addCampaignRewards(user, campaign)
          await user.save()
        }
        res.json({
          rewards: rewards,
          user: req.user
        })
      }
    }

  } catch (err) {
    next(err)
  }
}

// might move to a separate service module?
/**
 *
 * @param user
 * @param campaign
 * @param referrer
 * @return {Promise<{userRewards, referrerRewards}>} rewards the given user and the given referrer got
 */
async function handleReferralCode(user, campaign, referrer) {
  const referrerUser = await User.findById(referrer)
  if (!referrerUser) throw new StatusError("Referrer not found", 404)
  const referralRequirement = campaign.requirements.find(it => campaignTypes[it.type] === campaignTypes.referral)
  // who to reward and how to validate the referrer (i.e has made a purchase previously, old account or has email etc)
  const [rewardUsers, validationMethod] = referralRequirement.values

  if (validationMethod === 'has-purchase') {
    const purchases = referrerUser.customerData.purchases
    if (!purchases || !purchases.length) {
      throw new StatusError("Referrer must have made a purchased previously", 403)
    }
  } else if (validationMethod && validationMethod !== "none") {
    logger.severe(`Invalid referral validation method in ${campaign.id}/${campaign.name}: ${validationMethod}`)
  }
  if (user.referrer) throw new StatusError("You have already be referred by someone", 403)
  if (referrer === user.id) throw new StatusError("Can not refer yourself", 403)
  user.referrer = referrer
  const referralLimit = user.maxRefers
  if (referrerUser.referrerFor && referrerUser.referrerFor.length >= referralLimit) {
    throw new StatusError(`The user has reached the limit of ${referralLimit} referrals`, 403)
  }
  // register referrer/referrerFor (I know consistency is a thing but doesn't matter here)
  if (!referrerUser.referrerFor) referrerUser.referrerFor = [user.id]
  else referrerUser.referrerFor.push(user.id)

  const rewardScanner = rewardUsers === "referred" || rewardUsers === "both"
  const rewardReferrer = rewardUsers === "referrer" || rewardUsers === "both"
  let userRewards = rewardScanner ? await customerService.addCampaignRewards(user, campaign) : []
  let referrerRewards = rewardReferrer ? await customerService.addCampaignRewards(referrerUser, campaign) : []

  await user.save()
  await referrerUser.save()

  return {
    userRewards,
    referrerRewards
  }
}
