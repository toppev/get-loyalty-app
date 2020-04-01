const User = require('../models/user');
const Campaign = require('../models/campaign');

module.exports = {
    addPurchase,
    updatePurchase,
    deletePurchase,
    getPurchases,
    businessFromPurchase,
    updateCustomerProperties,
    addReward,
    deleteReward,
    addCampaignRewards,
    canReceiveCampaignRewards,
    findCustomerData

}

/**
 * Find the user's customerData for the given business
 * @param {object} user the user object
 * @param {any} businessId value of business's `_id` to query by
 */
async function findCustomerData(user, businessId) {
    const data = user.customerData.find(_item => _item.business.equals(businessId));
    return data;
}

/**
 * Update customerData's "properties" object. Returns the new properties object.
 * @param {any} userId value of the user's `_id` to query by
 * @param {any} businessId value of business's `_id` to query by
 * @param {Object} updateProperties the updates to perform. Values of this object are copied to current properties.
 */
async function updateCustomerProperties(userId, businessId, updateProperties) {
    const user = await User.findById(userId);
    const props = (await findCustomerData(user, businessId)).properties;
    const data = Object.assign(props, updateProperties);
    await user.save();
    return data;
}

/**
 * Add a new purchase. The user's all purchases in the given business.
 * @param {any} userId value of the user's `_id` to query by
 * @param {any} businessId value of business's `_id` to query by
 * @param {object} purchase the new purchase 
 */
async function addPurchase(userId, businessId, purchase) {
    const user = await User.findById(userId);
    let data = await findCustomerData(user, businessId);
    if (!data) {
        user.customerData.push({ business: businessId, purchases: [purchase] });
    }
    else {
        data.purchases.push(purchase);
    }
    await user.save();
    // return only this business's data
    const newData = await findCustomerData(user, businessId);
    return newData.purchases;
}

/**
 * Find the user of the given purchase
 * @param {any} purchaseId value of purchase's `_id` to query by
 */
async function userByPurchaseId(purchaseId) {
    const result = await User.findOne({ "customerData.purchases._id": purchaseId });
    return result;
}

/**
 * Find the business of the given purchase
 * @param {any} purchaseId value of purchase's `_id` to query by
 */
async function businessFromPurchase(purchaseId) {
    const user = await userByPurchaseId(purchaseId);
    if (!user) {
        return null;
    }
    return await findCustomerDataFromPurchase(user, purchaseId).business;
}

/**
 * Finds one element from customerData that contains the given purchaseId
 * @param {object} user the user who owns the purchase
 * @param {any} purchaseId value of purchase's `_id` to query by
 */
async function findCustomerDataFromPurchase(user, purchaseId) {
    for (let i in user.customerData) {
        const data = user.customerData[i];
        if (data.purchases && data.purchases.findIndex(_p => _p._id.equals(purchaseId)) > -1) {
            return data;
        }
    }
}

/**
 * Update the given purchase. Throws an error if the purchase is not found.
 * Returns the users current purchases (with the updated purchase)
 * @param {any} purchaseId value of purchase's `_id` to query by
 * @param {object} purchase the updated version of the purchase
 */
async function updatePurchase(userId, purchaseId, purchase) {
    purchase._id = purchaseId;
    const user = await User.findById(userId);
    if (!user) {
        throw Error('User not found');
    }
    const customerData = await findCustomerDataFromPurchase(user, purchaseId);
    const newPurchases = customerData.purchases.map(obj => obj._id.equals(purchaseId) ? Object.assign(obj, purchase) : obj);
    if (newPurchases.length != customerData.purchases.length) {
        user.customerData.purchases = newPurchases;
        await user.save();
    }
    return customerData.purchases;
}

/**
 * Delete the given purchases.
 * If the purchase doesn't exists in any user's purchases and error will be thrown.
 * Returns the list of purchases where the given purchase was (and is now removed)
 * @param {any} purchaseId value of purchase's `_id` to query by
 */
async function deletePurchase(userId, purchaseId) {
    const user = await User.findById(userId);
    if (!user) {
        throw Error('User not found');
    }
    const customerData = await findCustomerDataFromPurchase(user, purchaseId);
    const newPurchases = customerData.purchases.filter(purchase => purchase.id != purchaseId);
    if (newPurchases.length != customerData.purchases.length) {
        customerData.purchases = newPurchases;
        await user.save();
    }
    return customerData.purchases;
}

/**
 * Find all purchases by the given user in the given business. Returns a list of purchases
 * @param {any} id value of user's `_id` to query by
 * @param {any} business the business or its id
 */
async function getPurchases(id, business) {
    const user = await User.findById(id);
    return user.customerDataByBusiness(business).purchases;
}

/**
 * Add a new reward
 * @param userId the user to receive the reward
 * @param businessId the business giving the reward
 * @param reward the reward to give
 * @returns {Promise<[*]>} the user's updated customerData in the given business
 */
async function addReward(userId, businessId, reward) {
    const user = await User.findById(userId);
    let data = await findCustomerData(user, businessId);
    if (!data) {
        // create customer data for this business
        user.customerData.push({ business: businessId, rewards: [reward] });
    }
    else {
        data.rewards.push(reward);
    }
    await user.save();
    // return only this business's data
    const newData = await findCustomerData(user, businessId);
    return newData.rewards;
}

/**
 * Add all rewards from the campaign.
 * Increases rewardedCount but does not perform any checks, (use #canReceiveCampaignRewards)
 * 
 * @returns all given rewards (campaign.endReward)
 */
// TODO: test
async function addCampaignRewards(userId, campaign) {
    if (campaign.endReward.length) {
        campaign.endReward.forEach(reward => {
            addReward(userId, campaign.business, reward)
        })
        campaign.rewardedCount++
        await campaign.save();
    }
    return campaign.endReward

}

/**
 * Validate that the campaign is active and max rewards haven't been reached
 */
// TODO test
async function canReceiveCampaignRewards(userId, businessId, campaign) {
    const now = Date.now()
    if (campaign.start > now) {
        throw Error('The campaign has not strated yet')
    }
    if (campaign.end && campaign.end < now) {
        throw Error('The campaign has already ended')
    }
    if (campaign.maxRewards) {
        if (campaign.rewardedCount >= campaign.maxRewards.total) {
            throw Error('The campaign has run out of rewards :(')
        }
        const user = await User.findById(userId);
        const customerData = await findCustomerData(user, businessId);
        const allReceivedRewards = customerData ? customerData.rewards : []
        const receivedCount = allReceivedRewards.filter(reward => reward.campaigns.equals(campaign.id)).length
        if (receivedCount >= campaign.maxRewards.user) {
            throw Error('You have already received all rewards')
        }
    }
    return true
}

/**
 * Remove the reward given by the specified business from the user's customer data
 * @param userId the user
 * @param businessId the business
 * @param rewardId the reward to remove
 * @returns {Promise<*[]>}
 */
async function deleteReward(userId, businessId, rewardId) {
    const user = await User.findById(userId);
    const customerData = await findCustomerData(user, businessId);
    const newRewards = customerData.rewards.filter(reward => reward.id != rewardId);
    if (newRewards.length != customerData.rewards.length) {
        customerData.rewards = newRewards;
        await user.save();
    }
    return newRewards;
}