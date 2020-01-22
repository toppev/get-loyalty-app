const Business = require('../models/business');
const User = require('../models/user');

module.exports = {
    createBusiness,
    getBusiness,
    update,
    setUserRole,
    getPublicInformation
}

async function createBusiness(businessParam, userId) {
    const business = new Business(businessParam);
    await business.save();
    await setUserRole(business.id, userId, 'business');
    return business;
}

async function getBusiness(id) {
    return await Business.findById(id);
}

async function update(id, updateParam) {
    const business = await Business.findById(id);
    Object.assign(business, updateParam);
    return await business.save();
}

async function setUserRole(id, userId, role) {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User " + userId + " was not found");
    }
    const data = user.customerData;
    const index = data.findIndex(_item => _item.business == id);
    if (index > -1) {
        data[index].role = role;
    } else {
        data.push({ business: id, role: role });
    }
    await user.save();
    const newData = data.find(_item => _item.business == id);
    return { role: newData.role, business: newData.business };
}

async function getPublicInformation(id) {
    return await Business.findById(id).select('public');
}