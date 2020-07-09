const Business = require('../models/business');
const User = require('../models/user');
const uploader = require('../helpers/uploader');
const fs = require('fs');
const StatusError = require('../helpers/statusError');

module.exports = {
    getOwnBusiness,
    createBusiness,
    getBusiness,
    update,
    setUserRole,
    getPublicInformation,
    getIcon,
    uploadIcon
};

/**
 * Get the business the given user owns
 * @param user the user object (with customerData etc)
 *
 * @deprecated returns first business found, for legacy stuff.
 */
function getOwnBusiness(user) {
    return Business.findOne().id
}

/**
 * Create a new business and promote its owner
 * @param {object} businessParam the business object to create with optional fields from {@link Business}
 * @param {any} userId the owner's _id field. This user will be given 'business' rank
 */
async function createBusiness(businessParam, userId) {
    if(await Business.countDocuments() > 0) {
        throw new StatusError('Business already exists', 403)
    }
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
        throw new Error(`User ${userId} was not found`);
    }
    user.role = role;
    await user.save();
    // For legacy stuff return role and business separately too
    return { role: user.role, business: id, customerData: user.customerData };
}

/**
 * Get the public available information, anything in the business's ´public´ field
 * @param {any} id the business's _id field
 */
async function getPublicInformation(id) {
    return await Business.findById(id).select('public');
}

async function getIcon(businessId) {
    const file = uploader.toPath(`icon_${businessId}.ico`)
    return fs.existsSync(file) ? file : undefined;
}

async function uploadIcon(businessId, icon) {
    const path = await uploader.upload(`icon_${businessId}.ico`, icon)
    return { path }
}