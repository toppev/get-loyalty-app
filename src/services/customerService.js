const User = require('../models/user');

module.exports = {
    addPurchase,
    updatePurchase,
    deletePurchase,
    getPurchases,
    updateCustomer,
    updateCustomerProperties,
    addReward,
    deleteReward,
    addCampaignRewards,
    getCustomerInfo,
    updateRewards,
    useReward,
    searchCustomers,
    rewardAllCustomers,
    updateCustomerLevel,
    getCurrentLevel
};

/**
 * Get customerData AND other data that is available (e.g email, birthday)
 * @param user the user or the id of the user
 */
async function getCustomerInfo(user) {
    if (!user.customerData) { // Does not exists, the given param is the user id
        user = await User.findById(user);
    }
    const { _id, id, email, customerData, lastVisit, birthday, authentication } = user;
    return { _id, id, customerData, email, lastVisit, birthday, authentication: { service: authentication.service } }
}

/**
 * Update customerData object. Returns the new object.
 * @param {id} userId value of the user's `_id` to query by
 * @param {id} businessId value of business's `_id` to query by
 * @param {Object} updated the updates to perform. Values of this object are copied to current object
 */
async function updateCustomer(userId, businessId, updated) {
    const user = await User.findById(userId);
    const data = Object.assign(user.customerData, updated);
    await user.save();
    return data;
}


/**
 * Update customerData's "properties" object. Returns the new properties object.
 * @param {id} userId value of the user's `_id` to query by
 * @param {id} businessId value of business's `_id` to query by
 * @param {Object} updateProperties the updates to perform. Values of this object are copied to current properties.
 */
async function updateCustomerProperties(userId, businessId, updateProperties) {
    return await updateCustomer(userId, businessId, { properties: updateProperties })
}

/**
 * Add a new purchase. The user's all purchases in the given business.
 * @param {ObjectId|string} userId value of the user's `_id` to query by
 * @param {ObjectId|string} businessId value of business's `_id` to query by
 * @param {object} purchase the new purchase
 */
async function addPurchase(userId, businessId, purchase) {
    const user = await User.findById(userId);
    let data = user.customerData;
    if (!data) {
        user.customerData.push({ business: businessId, purchases: [purchase] });
    } else {
        data.purchases.push(purchase);
    }
    await user.save();
    return user.customerData.purchases;
}

/**
 * Update the given purchase. Throws an error if the purchase is not found.
 * Returns the users current purchases (with the updated purchase)
 * @param {id} userId the user's id
 * @param {id} purchaseId value of purchase's `_id` to query by
 * @param {object} purchase the updated version of the purchase
 */
async function updatePurchase(userId, purchaseId, purchase) {
    purchase._id = purchaseId;
    const user = await User.findById(userId);
    if (!user) {
        throw Error('User not found');
    }
    const customerData = user.customerData;
    const newPurchases = customerData.purchases.map(obj => obj._id.equals(purchaseId) ? Object.assign(obj, purchase) : obj);
    if (newPurchases.length !== customerData.purchases.length) {
        user.customerData.purchases = newPurchases;
        await user.save();
    }
    return customerData.purchases;
}

/**
 * Delete the given purchases.
 * If the purchase doesn't exists in any user's purchases and error will be thrown.
 * Returns the list of purchases where the given purchase was (and is now removed)
 * @param {id} userId the user's id
 * @param {id} purchaseId value of purchase's `_id` to query by
 */
async function deletePurchase(userId, purchaseId) {
    const user = await User.findById(userId);
    if (!user) {
        throw Error('User not found');
    }
    const customerData = user.customerData;
    const newPurchases = customerData.purchases.filter(purchase => purchase.id.toString() !== purchaseId);
    if (newPurchases.length !== customerData.purchases.length) {
        customerData.purchases = newPurchases;
        await user.save();
    }
    return customerData.purchases;
}

/**
 * Find all purchases by the given user in the given business. Returns a list of purchases
 * @param {id} id value of user's `_id` to query by
 * @param {business|id} business the business or its id
 */
async function getPurchases(id, business) {
    const user = await User.findById(id);
    return user.customerData.purchases;
}

/**
 * Add a new reward
 * @param userParam the id of the user or the user object, user to receive the reward
 * @param businessId the business giving the reward
 * @param reward the reward to give
 * @param save whether to save the user. Defaults to true
 * @returns {Promise<[*]>} all customer rewards (including the new one)
 */
async function addReward(userParam, businessId, reward, save) {
    // For some reason userParam.id is always truthy even if userParam is the id???
    const user = userParam.save ? userParam : await User.findById(userParam);
    let data = user.customerData;
    if (reward.customerPoints) {
        data.properties.points += reward.customerPoints
    }
    data.rewards.push(reward);
    if (save !== false) {
        await user.save();
    }
    return data.rewards;
}

async function useReward(user, customerData, reward) {
    customerData.rewards = customerData.rewards.filter(r => !r._id.equals(reward._id));
    customerData.usedRewards.push({ reward: reward });
    await user.save();
}

/**
 * A method to replace all rewards.
 * @param userId the id of the user
 * @param businessId the id of the business
 * @param newRewards the new rewards to save
 */
async function updateRewards(userId, businessId, newRewards) {
    const user = await User.findById(userId);
    const customerData = user.customerData;
    customerData.rewards = newRewards;
    await user.save();
    return newRewards;
}

/**
 * Remove the reward (if given by the specified business) from the user's customer data
 * @param userId the user
 * @param businessId the business
 * @param rewardId the reward to remove
 */
async function deleteReward(userId, businessId, rewardId) {
    const user = await User.findById(userId);
    const customerData = user.customerData;
    const newRewards = customerData.rewards.filter(reward => reward.id.toString() !== rewardId);
    if (newRewards.length !== customerData.rewards.length) {
        customerData.rewards = newRewards;
        await user.save();
    }
    return newRewards;
}

/**
 * Add all rewards from the campaign.
 * Increases rewardedCount but does not perform any checks, (use #canReceiveCampaignRewards).
 * Does not save the user!
 *
 * @param user the id of the user or the user object
 * @param campaign
 * @returns all given rewards (campaign.endReward)
 */
async function addCampaignRewards(user, campaign) {
    if (campaign.endReward && campaign.endReward.length) {
        for (const reward of campaign.endReward) {
            reward.campaign = campaign.id;
            await addReward(user, campaign.business, reward, false);
        }
        campaign.rewardedCount++;
        await campaign.save();
    }
    return campaign.endReward
}

function _listCustomers() {
    return User.find()
}

async function rewardAllCustomers(businessId, reward) {
    const customers = await _listCustomers();
    await Promise.all(customers.map(it => addReward(it, businessId, reward)));
    return { rewarded: customers.length }
}

/**
 * List customers of the business
 * @param businessId the id of the business
 * @param limit maximum number of customers to return, defaults to 100 first if "search" is not specified,
 * otherwise500. 0 for unlimited
 * @param search the string to search, if no limit is given, only the first 500 will be searched
 */
async function searchCustomers(businessId, limit, search) {
    // If searching, get first 500 customers and filter, otherwise return first 100
    // might fix later
    // FIXME: could be a lot better
    let users = await _listCustomers().limit(limit !== undefined ? limit : search ? 500 : 100);
    if (search && search.trim().length) {
        users = users.filter(u => JSON.stringify(u).toLowerCase().includes(search));
    }
    return Promise.all(users.map(u => getCustomerInfo(u, businessId)));
}

/**
 * Get the current level and give rewards if the user hasn't received them yet.
 * Saves the user if new rewards were given.
 * @param user the user
 * @param business the business
 * @return {currentLevel, points, newRewards} currentLevel may be undefined
 */
async function updateCustomerLevel(user, business) {
    const customerData = user.customerData;
    const points = customerData.properties.points
    const levels = business.public.customerLevels
    const currentLevel = getCurrentLevel(levels, points)

    const hasReceived = (reward) => {
        return customerData.rewards.some(it => it.recognition.equals(reward.recognition))
    }

    const newRewards = []
    if (currentLevel) {
        for (const reward of currentLevel.rewards) {
            if (!hasReceived(reward)) {
                await addReward(user, business, reward, false)
                newRewards.push(reward)
            }
        }
    }
    if (newRewards.length) {
        await user.save()
    }
    return {
        currentLevel,
        points,
        /** New rewards with original (therefore "wrong" ids) */
        newRewards
    }

}

function getCurrentLevel(levels, points) {
    let currentLevel = undefined
    levels.forEach(lvl => {
        if (points >= lvl.requiredPoints && (!currentLevel || lvl.requiredPoints > currentLevel.requiredPoints)) {
            currentLevel = lvl
        }
    })
    return currentLevel
}
