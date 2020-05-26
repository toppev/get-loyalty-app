const Campaign = require('../models/campaign');
const StatusError = require('../helpers/statusError');
const customerService = require('./customerService');
const userService = require('./userService');
const campaignTypes = require('@toppev/loyalty-campaigns');

module.exports = {
    getAllByBusinessId,
    getOnGoingCampaigns,
    getById,
    create,
    update,
    deleteCampaign,
    byCouponCode,
    canReceiveCampaignRewards
};

/**
 * Get all campaigns created by the given business
 * @param {any} businessId the business's _id field
 * @param populate whether to populate products and categories (etc)
 */
async function getAllByBusinessId(businessId, populate) {
    const res = Campaign.find({ business: businessId });
    if (populate) {
        res.populate('products categories');
    }
    return await res;
}

async function getOnGoingCampaigns(businessId, populate) {
    const all = await getAllByBusinessId(businessId, populate);
    const now = Date.now();
    return all.filter(c => c.start <= now && (!c.end || c.end > now));
}

/**
 * Get a campaign by its id
 * @param {any} campaignId the campaign's _id field
 */
async function getById(campaignId) {
    return Campaign.findById(campaignId);
}

/**
 * Create a new campaign. The business is automatically assigned to the campaign
 * @param {any} businessId the business's _id field
 * @param {Object} campaign the campaign to create
 */
async function create(businessId, campaign) {
    campaign.business = businessId;
    return Campaign.create(campaign);
}

/**
 * Update an existing campaign. Returns the updated product
 * @param {any} campaignId the campaign's _id value
 * @param {Object} updatedCampaign the object with the values to update
 */
async function update(campaignId, updatedCampaign) {
    // Update and return the new document
    const campaign = await Campaign.findByIdAndUpdate(campaignId, updatedCampaign, { new: true });
    return campaign;
}

/**
 * Delete an existing campaign from the database
 * @param {any} campaignId the campaign's _id value
 */
async function deleteCampaign(campaignId) {
    return await Campaign.findByIdAndDelete(campaignId)
}

async function byCouponCode(businessId, couponCode) {
    const campaigns = await Campaign.find({ business: businessId, couponCode: couponCode });
    if (campaigns.length > 1) {
        console.warn(`Business ${businessId} has multiple campaigns with the code ${couponCode}`)
    }
    return campaigns[0];
}


/**
 * Validate that the campaign is active, requirements are met and max rewards haven't been reached.
 *
 * @param userId id of the user
 * @param businessId id of the business
 * @param campaign the campaign object
 * @param answerQuestion see #isEligible
 */
async function canReceiveCampaignRewards(userId, businessId, campaign, answerQuestion) {
    const now = Date.now();
    if (campaign.start > now) {
        throw Error('The campaign has not started yet')
    }
    if (campaign.end && campaign.end < now) {
        throw Error('The campaign has already ended')
    }
    if (campaign.maxRewards) {
        if (campaign.rewardedCount >= campaign.maxRewards.total) {
            throw new StatusError('The campaign has run out of rewards :(', 410)
        }
        const user = await userService.getById(userId);
        const eligible = await isEligible(user, campaign, answerQuestion);
        if (!eligible) {
            throw new StatusError('You are not (currently) eligible for the reward.', 403)
        }
        const customerData = await customerService.findCustomerData(user, businessId);
        const allReceivedRewards = customerData ? customerData.rewards : [];
        const receivedCount = allReceivedRewards.filter(reward => reward.campaign && reward.campaign.equals(campaign.id)).length;
        if (receivedCount >= campaign.maxRewards.user) {
            throw new StatusError('You have already received all rewards', 403)
        }
    }
    return true
}

/**
 * Whether the user is eligible to receive the rewards (requirements are met, for example enough purchases).
 * Only checks requirements it can check with the given data. Therefore, this function ignores requirements with (cashier) questions.
 *
 * @param answerQuestion callback to answer whether the specified requirement question got a truthy answer. The callback gets the type as an argument.
 */
async function isEligible(user, campaign, answerQuestion) {
    const { requirements, business } = campaign;
    if (requirements.length === 0) {
        return true;
    }
    const customerData = await customerService.findCustomerData(user, business.id);
    return !requirements.some(req => {
        // Return true if the user is not eligible
        const campaignType = campaignTypes[req.type];
        if (campaignType && campaignType.requirement) {
            if (!campaignType.requirement(req.values, user, undefined, customerData)) {
                return true;
            }
        }
        // if answerQuestion is not defined the user is eligible (at least now, before cashier decides)
        if (req.question && answerQuestion) {
            return !answerQuestion(req.type);
        }
    })
}