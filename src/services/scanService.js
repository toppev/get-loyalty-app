const userService = require('./userService');
const StatusError = require('../helpers/statusError');
const customerService = require('./customerService');
const campaignService = require('./campaignService');
const pollingService = require('./pollingService');
const businessService = require('./businessService');
const format = require('../helpers/stringUtils').format;
const { asyncFilter } = require('../helpers/asyncFilter');

const IDENTIFIERS = {
    CONFIRM: 'confirm',
    PRODUCTS: 'products',
    CATEGORIES: 'products',
    REQUIREMENT: function (requirement) {
        return requirement.type;
    }
}

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
        addQuestions(questions, reward.categories, reward.products, [reward.requirement]);
        questions.push({ id: 'success', question: `Use reward "${reward.name}"?`, options: ['Yes', 'No'] });
        otherData.reward = reward;
    } else {
        const currentCampaigns = await campaignService.getOnGoingCampaigns(businessId, true);
        // Campaigns the user can (possibly) receive. I.e has not received and the campaign limits haven't been reached
        const campaigns = await asyncFilter(currentCampaigns, campaign => {
            return campaignService.canReceiveCampaignRewards(userId, businessId, campaign, () => true).catch(err => {
                if (err.name !== 'StatusError') {
                    throw err;
                }
            })
        });
        otherData.campaigns = campaigns;
        const categories = [].concat(...campaigns.map(c => c.categories));
        const products = [].concat(...campaigns.map(c => c.products));
        const requirements = [];
        campaigns.map(c => c.requirements).forEach(req => {
            if (req.question) {
                requirements.push(format(req.question, req.values))
            }
        })
        addQuestions(questions, categories, products, requirements);
        questions.push({ question: 'Confirm', options: ['Yes', 'No'] });
    }
    const business = await businessService.getBusiness(businessId);
    pollingService.sendToUser(userId, { message: business.config.translations.qrScanned.singular }, 'scan');
    return { questions, ...otherData };
}

function addQuestions(questions, categories, products, requirements) {
    if (categories && categories.length) {
        questions.push({
            id: IDENTIFIERS.CATEGORIES,
            question: 'Select categories',
            options: categories.map(c => c.name)
        })
    }
    if (products && products.length) {
        questions.push({
            id: IDENTIFIERS.PRODUCTS,
            question: 'Select products',
            options: products.map(p => p.name)
        })
    }
    if (requirements) {
        requirements.forEach(req => {
            if (req) {
                const identifier = IDENTIFIERS.REQUIREMENT(req);
                // No duplicate questions
                if (!questions.some(r => r.id === identifier)) {
                    questions.push({ id: identifier, question: req, options: ['Yes', 'No'] })
                }
            }
        })
    }
}

async function useScan(scanStr, data, businessId) {
    const { user, userId, rewardId } = await parseScanString(scanStr);
    const customerData = await customerService.findCustomerData(user, businessId);
    const reward = await validateRewardId(rewardId, customerData);
    const business = await businessService.getBusiness(businessId);
    const translations = business.config.translations;
    let responseMessage;
    let usedReward = reward;
    if (reward) {
        await customerService.useReward(user, customerData, reward)
        responseMessage = translations.rewardUsed.singular;
        pollingService.sendToUser(userId, { message: responseMessage }, 'reward_use')
    }
    const { answers } = data;

    const productQuestion = answers.find(e => e.id === IDENTIFIERS.PRODUCTS);
    const products = productQuestion ? productQuestion.options || [] : [];

    const categoryQuestion = answers.find(e => e.id === IDENTIFIERS.CATEGORIES);
    const categories = categoryQuestion ? categoryQuestion.options || [] : [];

    // Function that returns true if the given requirement/requirement type got truthy answer (from the human/cashier)
    const isTruthyAnswer = (requirement) => {
        const reqId = IDENTIFIERS.REQUIREMENT(requirement.type || requirement);
        const answer = answers.find(e => e.id === reqId);
        // It should just be 'no' or 'yes' but make sure if we change it, it will still work
        return answer && answer.toLowerCase() === 'yes';
    }
    await customerService.addPurchase(userId, businessId, { products, categories })
    const newRewards = [];
    const campaigns = await campaignService.getOnGoingCampaigns(businessId, true)
    for (const campaign of campaigns) {
        let eligible;
        try {
            // May throw (status)errors, catch them so it won't affect the response status now
            eligible = await campaignService.canReceiveCampaignRewards(userId, businessId, campaign, isTruthyAnswer);
        } catch (err) {
            // Not eligible
            eligible = false;
            if (err.name !== 'StatusError') {
                console.log(`ERROR! User not eligible to participate in a campaign because an error occurred ${err}`)
            }
            // IDEA: should we return reasons why the customer was not eligible?
        }
        if (eligible) {
            const rewards = await customerService.addCampaignRewards(user, campaign);
            newRewards.push(...rewards);
        }
    }
    if (newRewards.length) {
        const rewardNames = newRewards.map(it => it.name).join(', ')
        const message = format(newRewards.length === 1 ? translations.newReward.singular : translations.newReward.plural, rewardNames);
        pollingService.sendToUser(userId, { message: message }, 'reward_get');
    } else {
        pollingService.sendToUser(userId, { message: translations.scanRegistered.singular }, 'scan_end');
    }
    return { message: responseMessage, newRewards, usedReward }
}

module.exports = {
    getScan,
    useScan,
}