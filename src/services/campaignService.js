const Campaign = require('../models/campaign');
const Business = require('../models/business');
const StatusError = require('../helpers/statusError');
const userService = require('./userService');
const campaignTypes = require('@toppev/loyalty-campaigns');

module.exports = {
    getAllCampaigns,
    getOnGoingCampaigns,
    getById,
    create,
    update,
    deleteCampaign,
    byCouponCode,
    canReceiveCampaignRewards,
    getAllRewards,
    isEligible
};

/**
 * Get all campaigns created by the given business
 * @param populate whether to populate products and categories (etc)
 */
async function getAllCampaigns(populate) {
    const res = Campaign.find({});
    if (populate) {
        res.populate('products categories');
    }
    return await res;
}

/**
 * Get all campaign rewards from the business's campaigns
 */
async function getAllRewards() {
    const rewards = await Campaign.find({}).populate('endReward.categories endReward.products').select('endReward');
    return [].concat(...rewards.map(it => it.endReward));
}

async function getOnGoingCampaigns(populate) {
    const all = await getAllCampaigns(populate);
    return all.filter(isActive);
}

function isActive({ end, start }) {
    const now = Date.now();
    return start <= now && (!end || end > now)
}

/**
 * Get a campaign by its id
 * @param campaignId the campaign's _id field
 */
async function getById(campaignId) {
    return Campaign.findById(campaignId).populate('categories');
}

/**
 * Create a new campaign. The business is automatically assigned to the campaign.
 * @param {Object} campaign the campaign to create
 */
async function create(campaign) {
    const business = await Business.findOne();
    const limit = business.plan.limits.campaignsTotal;
    if (limit !== -1 && await Campaign.countDocuments({}) >= limit) {
        throw new StatusError('Plan limit reached', 402)
    }
    return Campaign.create(campaign);
}

/**
 * Update an existing campaign. Returns the updated product
 * @param {ObjectId|string} campaignId the campaign's _id value
 * @param {Object} updatedCampaign the object with the values to update
 */
async function update(campaignId, updatedCampaign) {
    const business = await Business.findOne();
    const limit = business.plan.limits.campaignsActive;
    if (limit !== -1 && isActive(updatedCampaign) && (await getOnGoingCampaigns()).length >= limit - 1) {
        throw new StatusError('Plan limit reached', 402)
    }
    const campaign = await getById(campaignId);
    Object.assign(campaign, updatedCampaign);
    return campaign.save();
}

/**
 * Delete an existing campaign from the database
 * @param {ObjectId|string} campaignId the campaign's _id value
 */
async function deleteCampaign(campaignId) {
    return await Campaign.findByIdAndDelete(campaignId)
}

async function byCouponCode(couponCode) {
    const campaigns = await Campaign.find({ couponCode: couponCode.toLowerCase() });
    if (campaigns.length > 1) {
        console.warn(`Business has multiple campaigns with the code ${couponCode}`)
    }
    return campaigns[0];
}


/**
 * Validate that the campaign is active, requirements are met and max rewards haven't been reached.
 *
 * @param userId id of the user
 * @param campaign the campaign object
 * @param answerQuestion see #isEligible
 */
async function canReceiveCampaignRewards(userId, campaign, answerQuestion) {
    const now = Date.now();
    if (campaign.start > now) {
        throw Error('The campaign has not started yet')
    }
    if (campaign.end && campaign.end < now) {
        throw Error('The campaign has already ended')
    }
    if (campaign.maxRewards) {
        // negative (preferably -1) or undefined means unlimited rewards
        if (campaign.maxRewards.total >= 0 && campaign.rewardedCount >= campaign.maxRewards.total) {
            throw new StatusError('The campaign has run out of rewards :(', 410)
        }
        const user = await userService.getById(userId);
        const eligible = await isEligible(user, campaign, answerQuestion);
        if (!eligible) {
            throw new StatusError('You are not (currently) eligible for the reward.', 403)
        }
        if (campaign.maxRewards.user >= 0) {
            const customerData = user.customerData;
            const allReceivedRewards = customerData.rewards;
            const receivedCount = allReceivedRewards.filter(reward => reward.campaign && reward.campaign.equals(campaign.id)).length;
            if (receivedCount >= campaign.maxRewards.user) {
                throw new StatusError('You have already received all rewards', 403)
            }
        }
    }
    return true
}

/**
 * Checks that the campaign requirements (campaign types) are met.
 * For example, the user has enough purchases or the purchase was a specific product (see answerQuestion param).
 * Ignores campaign dates etc. Only checks the requirements.
 *
 * @param {User} user the user
 * @param {Campaign} campaign the campaign
 * @param {Function<boolean>} answerQuestion callback to answer whether the specified requirement question got a
 * truthy answer. The callback gets the type (string) as an argument.
 */
async function isEligible(user, campaign, answerQuestion) {
    const { requirements } = campaign;
    if (requirements.length === 0) {
        return true;
    }
    return !requirements.some(req => {
        // Return true if the user is not eligible
        const campaignType = campaignTypes[req.type];
        if (campaignType && campaignType.requirement) {
            if (!campaignType.requirement({ values: req.values, user, customerData: user.customerData })) {
                return true;
            }
        }
        // if answerQuestion is not defined the user is eligible (at least now, before cashier decides)
        if (req.question && answerQuestion) {
            return !answerQuestion(req.type);
        }
    })
}