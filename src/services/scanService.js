const userService = require('./userService');
const StatusError = require('../helpers/statusError');
const customerService = require('./customerService');
const campaignService = require('./campaignService');
const pollingService = require('./pollingService');
const businessService = require('./businessService');
const format = require('../helpers/stringUtils').format;
const { asyncFilter } = require('../helpers/asyncFilter');

const POLLING_IDENTIFIERS = pollingService.IDENTIFIERS;

// IDs used to identify questions so the actual human-readable question does not matter
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
 * @return {Promise<{rewardId: string, user: *, userId: string}>}
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
 */
async function getScan(scanStr, businessId) {
    const { user, userId, rewardId } = await parseScanString(scanStr);
    const customerData = user.customerData;
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
    pollingService.sendToUser(userId, {
        message: business.config.translations.qrScanned.singular,
        refresh: false,
        vibrate: [200]
    }, POLLING_IDENTIFIERS.SCAN);
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
    const customerData = user.customerData;
    const reward = await validateRewardId(rewardId, customerData);
    const business = await businessService.getBusiness(businessId);
    const translations = business.config.translations;

    let responseMessage;

    if (reward) {
        await customerService.useReward(user, customerData, reward)
        responseMessage = translations.rewardUsed.singular;
        pollingService.sendToUser(userId, { message: responseMessage, refresh: true }, POLLING_IDENTIFIERS.REWARD_USE)
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

    let newRewards = [];
    const campaigns = await campaignService.getOnGoingCampaigns(businessId, true)
    for (const campaign of campaigns) {
        let eligible;
        // May throw (status)errors, catch them so it won't affect the response status
        try {
            eligible = await campaignService.isEligible(user, campaign, isTruthyAnswer)
            if (eligible) {
                if (await campaignService.canReceiveCampaignRewards(userId, businessId, campaign, isTruthyAnswer)) {
                    const rewards = await customerService.addCampaignRewards(user, campaign);
                    newRewards.push(...rewards);
                }
                // transactionPoints are always given if the user is eligible for the campaign
                if (campaign.transactionPoints) {
                    customerData.properties.points += campaign.transactionPoints;
                }
            }
        } catch (err) {
            // Not eligible
            eligible = false;
            if (err.name !== 'StatusError') {
                console.log(`ERROR! User not eligible to participate in a campaign because an error occurred ${err}`)
            }
            // IDEA: should we return reasons why the customer was not eligible?
        }
    }

    // Campaigns may reward with customer points so recalculate customer level and add the customer level
    // rewards (if any) in the new rewards array so the user will be notified of them too
    // FIXME: we are ignoring customer points they may receive from the customer level rewards.
    //  Probably fine to ignore as there's no point rewarding with points when the user reaches X points
    const customerLevel = await customerService.updateCustomerLevel(user, business);
    newRewards.push(...customerLevel.newRewards)

    if (newRewards.length) {
        _sendRewardsMessage(userId, business, newRewards)
    } else {
        pollingService.sendToUser(userId, {
            message: translations.scanRegistered.singular,
            refresh: true
        }, POLLING_IDENTIFIERS.SCAN_GET);
    }
    await user.save() // Save unsaved changes
    return { message: responseMessage, newRewards, usedReward: reward }
}


function _sendRewardsMessage(userId, business, newRewards) {
    const translations = business.config.translations;
    const rewardNames = newRewards.map(it => it.name).join(', ')
    const message = format(newRewards.length === 1 ? translations.newReward.singular : translations.newReward.plural, rewardNames);
    pollingService.sendToUser(userId, { message: message, refresh: true }, POLLING_IDENTIFIERS.REWARD_GET);
}


module.exports = {
    getScan,
    useScan,
}
