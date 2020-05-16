const userService = require('./userService');
const StatusError = require('../helpers/statusError');
const customerService = require('./customerService');
const campaignService = require('./campaignService');
const pollingService = require('./pollingService');

/**
 * Parse the scanned string
 * @param scanStr the string to parse, values separated with ":"
 * @returns {{userId: string, rewardId: string|undefined,}}
 */
async function parseScanString(scanStr) {
    const split = scanStr.split(":");
    const userId = split[0];
    const user = await userService.getById(userId);
    if (!user) {
        throw new StatusError('User not found', 404);
    }
    const rewardId = split[1];
    return { user, userId, rewardId }
}

/**
 * Validate that the reward exists in the given customerData
 * @param rewardId
 * @param customerData
 * @returns {Promise<T>}
 */
async function validateRewardId(rewardId, customerData) {
    if (rewardId) {
        // The reward is the entire object, not only the id
        const reward = customerData.rewards.find(r => r._id.equals(rewardId));
        if (!reward) {
            throw new StatusError('Customer selected reward but the reward was not found.');
        }
        return reward
    }
}

/**
 * Get data from the scan
 * @param scanStr the scanned string
 * @param businessId
 * @returns {Promise<{questions: [], customerData: *, reward: Reward|undefined, campaigns: Campaign[]|undefined}>}
 */
async function getScan(scanStr, businessId) {
    const { user, userId, rewardId } = await parseScanString(scanStr);
    const customerData = await customerService.findCustomerData(user, businessId);
    const otherData = { customerData };
    const questions = [];
    const reward = await validateRewardId(rewardId, customerData);
    if (reward) {
        otherData.reward = reward;
    } else {
        otherData.campaigns = await campaignService.getOnGoingCampaigns(businessId, true);
    }
    // TODO: change message
    pollingService.sendToUser(userId, { message: 'QR code scanned!' }, 'scan')
    return { questions, ...otherData };
}

async function useScan(scanStr, data, businessId) {
    const { user, userId, rewardId } = await parseScanString(scanStr);
    const customerData = await customerService.findCustomerData(user, businessId);
    const reward = await validateRewardId(rewardId, customerData);
    let responseMessage;
    if (reward) {
        await customerService.useReward(user, customerData, reward)
        responseMessage = 'Reward Used!';
        pollingService.sendToUser(userId, { message: responseMessage }, 'reward_use')
    }
    const { products, categories } = data;
    await customerService.addPurchase(userId, businessId, { products, categories })
    const newRewards = [];
    const campaigns = await campaignService.getAllByBusinessId(businessId, true)
    for (const campaign of campaigns) {
        let eligible;
        try {
            // May throw (status)errors, catch them so it won't affect the response status
            eligible = await campaignService.canReceiveCampaignRewards(userId, businessId, campaign);
        } catch (err) {
            // Not eligible
            eligible = false;
            if (err.name !== 'StatusError') {
                console.log(`ERROR! User not eligible to participate in campaign because ${err}`)
            }
        }
        if (eligible) {
            const rewards = await customerService.addCampaignRewards(user, campaign);
            newRewards.push(...rewards);
        }
    }
    if (newRewards.length) {
        const rewardString = newRewards.length > 1 ? 'new rewards' : 'a new reward';
        responseMessage = `The customer got ${rewardString}!`;
        pollingService.sendToUser(userId, { message: `You got ${rewardString}!` }, 'reward_get');
    } else {
        pollingService.sendToUser(userId, { message: 'Done!' }, 'scan_end');
    }
    return { message: responseMessage, newRewards }
}

module.exports = {
    getScan,
    useScan,
}