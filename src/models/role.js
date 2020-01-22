const campaignService = require('../services/campaignService');
const productService = require('../services/productService');
const userService = require('../services/userService');

// Roles and permsissions
// * is a wildcard
const roles = {
    admin: {
        can: { '*': true },
    },
    business: {
        can: {
            // No need to check because the role is from the requested business's data
            'business:*': true,
            // These must be checked
            'campaign:*': _ownCampaignOnly,
            'product:*': _ownProductOnly,
            'purchase:*': _ownCustomerPurchaseOnly
        },
    },
    user: {
        can: {
            'campaign:list': true,
            'product:list': true,
            'user:*': _ownUserOnly
        }
    }
}

/**
 * Checks whether the product is owner by the same business
 * or the product is not found (usually only for creating a new product)
 */
async function _ownProductOnly(params) {
    const reqParams = params.reqParams;
    const productId = reqParams.productId;
    const product = await productService.getById(productId);
    return !product || (product.business && product.business == reqParams.businessId);
}

/**
 * Checks whether the campaign is owner by the same business
 * or the campaign is not found (usually only for creating a new campaign)
 */
async function _ownCampaignOnly(params) {
    const reqParams = params.reqParams;
    const campaignId = reqParams.campaignId;
    const campaign = await campaignService.getById(campaignId);
    return !campaign || (campaign.business && campaign.business == reqParams.businessId);
}

/**
 * Checks whether the purchase's (params.purchaseId) business equals the business (params.reqParams.businessId)
 * or the purchase is not found (usually only for creating a new purchase)
 */
async function _ownCustomerPurchaseOnly(params) {
    const reqParams = params.reqParams;
    const businessId = await userService.businessFromPurchase(reqParams.purchaseId);
    return !businessId || (businessId == reqParams.businessId);
}

/**
 * Checks whether the params.userId equals params.reqParams.userId
 */
async function _ownUserOnly(params) {
    const reqParams = params.reqParams;
    return params.userId && params.userId == reqParams.userId;
}

async function can(role, operation, params) {
    if (!this.roles[role]) {
        return false;
    }
    const $role = this.roles[role];
    const can = $role.can;
    if (await _canOperation(can, '*', params)) {
        return true;
    }
    if (await _canOperation(can, operation, params)) {
        return true;
    }
    // e.g product:create and product:remove operations will accept product:*
    const operationWildcard = operation.substring(0, operation.indexOf(':')) + ':*';
    if (await _canOperation(can, operationWildcard, params)) {
        return true;
    }
    return $role.inherits && $role.inherits.some(childRole => this.can(childRole, operation, params));
}

async function _canOperation(can, operation, params) {
    if (!can[operation] === undefined) {
        return false;
    }
    if (typeof can[operation] !== 'function') {
        return can[operation];
    }
    return can[operation](params);
}

module.exports = {
    roles,
    can,
}