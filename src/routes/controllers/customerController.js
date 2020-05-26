const router = require('express').Router({ mergeParams: true });
const customerService = require('../../services/customerService');
const permit = require('../../middlewares/permitMiddleware');

const validation = require('../../helpers/validation');
const purchaseValidator = validation.validate(validation.purchaseValidator);
const propertiesValidator = validation.validate(validation.customerPropertiesValidator);
const rewardValidator = validation.validate(validation.rewardValidator);

// TODO: list customers
router.post('/purchase/', permit('purchase:create'), purchaseValidator, newPurchase);
router.patch('/purchase/:purchaseId', permit('purchase:update'), purchaseValidator, updatePurchase);
router.delete('/purchase/:purchaseId', permit('purchase:delete'), deletePurchase);

router.post('/rewards', permit('reward:update'), rewardValidator, updateRewards); // TODO: test
router.delete('/reward/:rewardId', permit('reward:revoke'), rewardValidator, revokeReward);
router.post('/reward', permit('reward:give'), rewardValidator, giveReward);
router.patch('/properties', permit('customer:update'), propertiesValidator, updateCustomerProperties);
router.get('/', permit('customer:get'), getCustomerData);

module.exports = router;

// PURCHASES
function newPurchase(req, res, next) {
    const { businessId, userId } = req.params;
    customerService.addPurchase(userId, businessId, req.body)
        .then(purchases => res.json({ purchases: purchases }))
        .catch(err => next(err));
}

function updatePurchase(req, res, next) {
    const { purchaseId, userId } = req.params;
    customerService.updatePurchase(userId, purchaseId, req.body)
        .then(purchases => res.json({ purchases: purchases }))
        .catch(err => next(err));
}

function deletePurchase(req, res, next) {
    const { purchaseId, userId } = req.params;
    customerService.deletePurchase(userId, purchaseId)
        .then(() => res.json({}))
        .catch(err => next(err));
}

// Rewards
function giveReward(req, res, next) {
    const { businessId, userId } = req.params;
    customerService.addReward(userId, businessId, req.body)
        .then(data => res.json({ rewards: data }))
        .catch(err => next(err));
}

// Might use later
// Should this also return basic information of the user
function updateRewards(req, res, next) {
    const { businessId, userId } = req.params;
    customerService.updateRewards(userId, businessId, req.body)
        .then(data => res.json({ rewards: data }))
        .catch(err => next(err));
}

function revokeReward(req, res, next) {
    const { rewardId, businessId, userId } = req.params;
    customerService.deleteReward(userId, businessId, rewardId)
        .then(data => res.json({ rewards: data }))
        .catch(err => next(err));
}

// Other stuff
function getCustomerData(req, res, next) {
    const { businessId, userId } = req.params;
    customerService.findCustomerData(userId, businessId)
        .then(data => res.json({ customerData: data }))
        .catch(err => next(err));
}

function updateCustomerProperties(req, res, next) {
    const userId = req.params.userId;
    customerService.updateCustomerProperties(userId, req.params.businessId, req.body)
        .then(properties => res.json(properties))
        .catch(err => next(err));
}