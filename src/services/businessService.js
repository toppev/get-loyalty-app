const Business = require('../models/business');
const User = require('../models/user');
const uploader = require('../helpers/uploader');
const fs = require('fs');
const StatusError = require('../helpers/statusError');
const templateService = require('./templateService');
const iconService = require('./iconService');


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
 * Get the id of the business the given user owns.
 *
 * @param user the user object (with customerData etc)
 * @return returns id of the first business found (only 1 business)
 * @deprecated Mainly for legacy stuff only.
 */
async function getOwnBusiness(user) {
    if (user.role === 'business') {
        return (await Business.findOne()).id
    }
    return undefined
}

/**
 * Create a new business and promote its owner
 * @param {object} businessParam the business object to create with optional fields from {@link Business}
 * @param {any} userId the owner's _id field. This user will be given 'business' rank
 */
async function createBusiness(businessParam, userId) {
    if (await Business.countDocuments() > 0) {
        throw new StatusError('Business already exists', 403)
    }
    const business = new Business(businessParam);
    await business.save();
    await setUserRole(userId, 'business');
    templateService.loadDefaultTemplates().then();
    return business;
}

/**
 * Find a business by its id
 */
async function getBusiness() {
    return Business.findOne().populate({
        path: 'public.customerLevels', populate: [{
            path: 'rewards.categories',
            model: 'Category',
        }, {
            path: 'rewards.products',
            model: 'Product',
        }]
    })
}

/**
 * Update an business. Does not replace the business, instead only updates the given fields.
 * @param {Object} updateParam the object whose fields will be copied to business.
 */
async function update(updateParam) {
    const business = await Business.findOne();
    Object.assign(business, updateParam);
    return business.save();
}

/**
 * Set the user's role in this business. Updates customerData of the user and returns an object with role and business's id:
 * @example {role: 'user', business: '5e38360f3afaeaff8581e78a'}
 *
 * @param {any} userId the user's _id field
 * @param {string} role the role as a string
 */
async function setUserRole(userId, role) {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error(`User ${userId} was not found`);
    }
    user.role = role;
    await user.save();
    // For legacy stuff return role and business separately too
    return { role: user.role, business: (await Business.findOne()).id, customerData: user.customerData };
}

/**
 * Get the public available information, anything in the business's ´public´ field
 */
async function getPublicInformation() {
    return Business.findOne().select('public');
}

async function getIcon(size) {
    let file;
    if (size) {
        file = uploader.toPath(`icons/icon-${size}.png`)
        if (fs.existsSync(file)) return file;
        file = uploader.toPath(`icons/icon.png`)
    } else {
        file = uploader.toPath(`icons/favicon.ico`)
    }
    return fs.existsSync(file) ? file : undefined
}

async function uploadIcon(icon) {
    const path = await uploader.upload('icons', 'icon.png', icon)
    await iconService.resizeToPNG(icon, [180, 192, 512], uploader.toPath('icons'), 'icon')
    await iconService.generateFavicon(uploader.toPath('icons/icon-192.png'), uploader.toPath('icons/favicon.ico'))
    return { path }
}