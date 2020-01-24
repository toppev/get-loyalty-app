const User = require('../models/user');
const emailPasswordReset = require('../helpers/mailer');
const ResetPassword = require('../models/passwordReset');
const crypto = require('crypto');

module.exports = {
    getAll,
    getById,
    create,
    update,
    forgotPassword,
    resetPassword,
    deleteUser,
    addPurchase,
    updatePurchase,
    deletePurchase,
    getPurchases,
    businessFromPurchase
};

async function forgotPassword(email) {
    const userId = await User.findOne({
        email: email
    }).select('_id');
    // Don't let the user know if the email exists
    if (userId) {
        const buffer = crypto.randomBytes(16);
        const token = buffer.toString('hex');
        console.log(token)
        const reset = new ResetPassword({
            token,
            userId
        });
        await reset.save();
        // TODO: enable
        //emailPasswordReset(email, token);
    }
}

async function resetPassword(token) {
    if (!token) {
        throw 'No token parameter specified.';
    }
    const request = await ResetPassword.findByToken(token);
    if (!request) {
        throw 'Invalid password reset request link.';
    }
    const minutes = 60;
    if (request.updatedAt < Date.now() - minutes * 60 * 1000) {
        throw 'Password reset request expired.';
    }
    ResetPassword.deleteOne({ id: request.id });
    return await User.findById(request.userId);
}

async function getAll() {
    return await User.find().select('-password');
}

async function getById(id) {
    return await User.findById(id).select('-password');
}

async function create(userParam) {
    const user = new User(userParam);
    return await user.save();
}

async function findCustomerData(user, businessId) {
    const data = user.customerData.find(_item => _item.business == businessId);
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

/**
 * Finds one element from customerData that contains the given purchaseId
 * @param {object} user the user who owns the purchase
 * @param {(string|object)} purchaseId the purchase's id
 */
async function findCustomerDataFromPurchase(user, purchaseId) {
    for (let i in user.customerData) {
        const data = user.customerData[i];
        if (data.purchases && data.purchases.findIndex(_p => _p._id == purchaseId) > -1) {
            return data;
        }
    }
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

async function update(id, updateParam) {
    const user = await User.findById(id);
    Object.assign(user, updateParam);
    return await user.save();
}

async function deleteUser(id) {
    await User.findByIdAndRemove(id);
}