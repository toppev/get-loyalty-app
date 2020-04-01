const Campaign = require('../models/campaign');

module.exports = {
    getAllByBusinessId,
    getById,
    create,
    update,
    deleteCampaign,
    byCouponCode
};

/**
 * Get all campaigns created by the given business
 * @param {any} businessId the business's _id field
 */
async function getAllByBusinessId(businessId) {
    return await Campaign.find({ business: businessId });
}

/**
 * Get a campaign by its id
 * @param {any} campaignId the campaign's _id field
 */
async function getById(campaignId) {
    return await Campaign.findById(campaignId);
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
    return await Campaign.find({ business: businessId, couponCode: couponCode });
}