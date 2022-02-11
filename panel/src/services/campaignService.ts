import { get, patch, post, remove } from "../config/axios"
import { Campaign } from "../components/campaigns/Campaign"


function listCampaigns() {
  return get(`/campaign/all`)
}

function createCampaign(campaign: Campaign) {
  return post(`/campaign`, campaign)
}

function updateCampaign(campaign: Campaign) {
  return patch(`/campaign/${campaign?.id}`, campaign)
}

function deleteCampaign(campaign: Campaign) {
  return remove(`/campaign/${campaign?.id}`)
}

export {
  listCampaigns,
  updateCampaign,
  createCampaign,
  deleteCampaign,
}
