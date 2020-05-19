import { BUSINESS_ID, get, patch, post, remove } from "../config/axios";
import { Campaign } from "../components/campaigns/Campaign";


function listCampaigns() {
    const subUrl = `/business/${BUSINESS_ID}/campaign`
    return get(`${subUrl}/all`);
}

function createCampaign(campaign: Campaign) {
    const subUrl = `/business/${BUSINESS_ID}/campaign`
    return post(`${subUrl}`, campaign);
}

function updateCampaign(campaign: Campaign) {
    const subUrl = `/business/${BUSINESS_ID}/campaign/${campaign?._id}`
    return patch(`${subUrl}`, campaign);
}

function deleteCampaign(campaign: Campaign) {
    const subUrl = `/business/${BUSINESS_ID}/campaign/${campaign?._id}`
    return remove(`${subUrl}`)
}

function loadCampaign(campaignId: string) {
    const subUrl = `/business/${BUSINESS_ID}/campaign/{campaignId}`;
    return get(`${subUrl}`);
}


export {
    listCampaigns,
    updateCampaign,
    createCampaign,
    deleteCampaign,
    loadCampaign
}