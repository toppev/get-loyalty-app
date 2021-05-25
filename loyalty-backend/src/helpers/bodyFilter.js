/**
 * This module has a #validate function to filter any harmful properties from the body.
 * e.g changing owner of a product or changing the business account's plan or user role
 */

const StatusError = require('../helpers/statusError')

/**
 * If the user doesn't have the given permission the filter will remove fields from the request that the user is not
 * allowed to modify. In some cases the validator may throw an error. For example, if the property is allowed by
 * it's value is not (e.g a role)
 *
 * @param filter {function(reqBody: {})}
 * @param bypassPermission bypass permission, by default "validation:bypass"
 */
function validateWith(filter, bypassPermission = "validation:bypass") {
  return async (req, res, next) => {
    // Check if the user has permission to bypass validation (site admins)
    try {
      const bypass = req.user && await req.user.hasPermission(bypassPermission, { userId: req.user.id, reqParams: req.params })
      if (bypass) {
        next()
      } else {
        filter(req.body)
        next()
      }
    } catch (err) {
      next(err)
    }
  }
}

const userValidator = (user) => {
  delete user._id
  delete user.lastVisit
  delete user.authentication
  delete user.customerData
}

const businessValidator = (business) => {
  delete business.plan
}

const businessRoleValidator = (data) => {
  if (!["user", "business"].includes(data.role)) {
    throw new StatusError(`Forbidden role: "${data.role}"`, 400)
  }
}

const productValidator = (product) => {
}

const rewardValidator = (reward) => {
}

const campaignValidator = (campaign) => {
}

const purchaseValidator = (purchase) => {
}

const customerPropertiesValidator = (customer) => {
}

const pushNotificationValidator = (notification) => {
  delete notification.sent
  delete notification.receivers
}

const pageValidator = (page) => {
}

module.exports = {
  validate: validateWith,
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
}
