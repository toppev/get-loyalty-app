const Business = require('../models/business');
const User = require('../models/user');

module.exports = {
    createBusiness,
    getBusiness,
    update,
    setUserRole,
    getPublicInformation
};

/**
 * Create a new business and promote its owner
 * @param {object} businessParam the business object to create with optional fields from {@link Business}
 * @param {any} userId the owner's _id field. This user will be given 'business' rank
 */
async function createBusiness(businessParam, userId) {
    const business = new Business(businessParam);
    await business.save();
    await setUserRole(business.id, userId, 'business');
    return business;
}

/**
 * Find a business by its id
 * @param {any} id the business's _id field
 */
async function getBusiness(id) {
    return await Business.findById(id);
}

/**
 * Update an business. Does not replace the business, instead only updates the given fields.
 * @param {any} id the business's _id field
 * @param {Object} updateParam the object whose fields will be copied to business.
 */
async function update(id, updateParam) {
    const business = await Business.findById(id);
    Object.assign(business, updateParam);
    return await business.save();
}

/**
 * Set the user's role in this business. Updates customerData of the user and returns an object with role and business's id:
 * @example {role: 'user', business: '5e38360f3afaeaff8581e78a'}
 *
 * @param {any} id the business's _id field
 * @param {any} userId the user's _id field
 * @param {string} role the role as a string
 */
async function setUserRole(id, userId, role) {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User " + userId + " was not found");
    }
    const data = user.customerData;
    // FIXME replacing == with === will break
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

/**
 * Get the public available information, anything in the business's ´public´ field
 * @param {any} id the business's _id field
 */
async function getPublicInformation(id) {
    return await Business.findById(id).select('public');
}