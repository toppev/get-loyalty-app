const Campaign = require('../models/campaign');

module.exports = {
    getAllByBusinessId,
    getById,
    create,
    update,
    deleteCampaign
}

async function getAllByBusinessId(businessId) {
    return await Campaign.find({ business: businessId });
}

async function getById(campaignId) {
    return await Campaign.findById(campaignId);
}

async function create(businessId, campaign) {
    campaign.business = businessId;
    return await Campaign.create(campaign);
}

async function update(campaignId, updatedCampaign) {
    // Update and return the new document
    const campaign = await Campaign.findByIdAndUpdate(campaignId, updatedCampaign, { new: true });
    return campaign;
}

async function deleteCampaign(campaignId) {
    return await Campaign.findByIdAndDelete(campaignId)
}