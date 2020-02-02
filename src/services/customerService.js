const User = require('../models/user');

module.exports = {
    addPurchase,
    updatePurchase,
    deletePurchase,
    getPurchases,
    businessFromPurchase
}


async function findCustomerData(user, businessId) {
    const data = user.customerData.find(_item => _item.business == businessId);
    return data;
}

/**
 * Update customerData's "properties" object
 * @param {ObjectId} userId 
 * @param {ObjectId} businessId 
 * @param {Object} updateProperties 
 */
async function updateCustomerProperties(userId, businessId, updateProperties) {
    const user = await User.findById(userId);
    const props = await findCustomerData(user, businessId).properties;
    Object.assign(props, updateProperties);
    await user.save();
    return data;
}

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
    const newData = await findCustomerData(user, businessId);
    return newData.purchases;
}

async function userByPurchaseId(purchaseId) {
    const result = await User.findOne({ "customerData.purchases._id": purchaseId });
    return result;
}

async function businessFromPurchase(purchaseId) {
    const user = await userByPurchaseId(purchaseId);
    if (!user) {
        return null;
    }
    return await findCustomerDataFromPurchase(user, purchaseId).business;
}

async function updatePurchase(purchaseId, purchase) {
    purchase._id = purchaseId;
    const user = await userByPurchaseId(purchaseId);
    if (!user) {
        throw Error('User not found with the given purchaseId');
    }
    const customerData = await findCustomerDataFromPurchase(user, purchaseId);
    const newPurchases = customerData.purchases.map(obj => obj.id == purchaseId ? updatedPurchase = Object.assign(obj, purchase) : obj);
    if (newPurchases.length != customerData.purchases.length) {
        user.customerData.purchases = newPurchases;
        await user.save();
    }
    return customerData.purchases;
}

async function deletePurchase(purchaseId) {
    const user = await userByPurchaseId(purchaseId);
    if (!user) {
        throw Error('User not found with the given purchaseId');
    }
    const customerData = await findCustomerDataFromPurchase(user, purchaseId);
    const newPurchases = customerData.purchases.filter(purchase => purchase.id != purchaseId);
    if (newPurchases.length != customerData.purchases.length) {
        customerData.purchases = newPurchases;
        await user.save();
    }
    return customerData.purchases;
}

async function getPurchases(id, business) {
    const user = await User.findById(id);
    return user.customerDataByBusiness(business).purchases;
}