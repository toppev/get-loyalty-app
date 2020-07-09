/**
 * This module has a #validate function to filter any harmful properties from the body.
 * e.g changing owner of a product or changing the business account's plan or user role
 */

const StatusError = require('../helpers/statusError');

/**
 * If the user doesn't have the given permission the filter will remove fields from the request that the user is not
 * allowed to modify. In some cases the validator may throw an error. For example, if the property is allowed by
 * it's value is not (e.g a role)
 *
 * @param filter the filter to use
 * @param bypassPermission bypass permission, by default "validation:bypass"
 */
function validate(filter, bypassPermission = "validation:bypass") {
    return (req, res, next) => {
        // Check if the user has permission to bypass validation (site admins)
        Promise.resolve(!req.user ? false : req.user.hasPermission(bypassPermission, {
            userId: req.user.id,
            reqParams: req.params
        })).then(result => {
            if (result) {
                next();
            } else {
                filter(req.body)
                next()
            }
        }).catch(err => next(err))
    }
}

const userValidator = (user) => {
    delete user._id
    delete user.lastVisit
    delete user.authentication
    delete user.customerData
};

const businessValidator = (business) => {
    delete business._id
    delete business.plan
};

const businessRoleValidator = (data) => {
    if (data.role !== "user" && data.role !== "business") {
        throw new StatusError(`Forbidden role: "${data.role}"`, 400)
    }
};

const productValidator = (product) => {
    delete product._id
    delete product._id
};

const rewardValidator = (reward) => {
    delete reward._id
};

const campaignValidator = (campaign) => {
    delete campaign._id
    delete campaign.business

};

const purchaseValidator = (purchase) => {
    delete purchase._id
    // Nothing for now
};

const customerPropertiesValidator = (customer) => {
    delete customer._id
    // Nothing for now
};

const pushNotificationValidator = (notification) => {
    delete notification.business
    delete notification.sent
    delete notification.receivers
}

const pageValidator = (page) => {
    delete page._id
    delete page.business
    delete page.template
}

module.exports = {
    validate,
    userValidator,
    businessValidator,
    businessRoleValidator,
    productValidator,
    campaignValidator,
    purchaseValidator,
    customerPropertiesValidator,
    rewardValidator,
    pushNotificationValidator,
    pageValidator
};