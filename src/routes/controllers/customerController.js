const router = require('express').Router({ mergeParams: true });
const customerService = require('../../services/customerService');
const permit = require('../../middlewares/permitMiddleware');

const validation = require('../../helpers/validation');
const purchaseValidator = validation.validate(validation.purchaseValidator);
const propertiesValidator = validation.validate(validation.customerPropertiesValidator);

// userId param is the user
router.post('/purchase/', permit('purchase:create'), purchaseValidator, newPurchase);
router.patch('/purchase/:purchaseId', permit('purchase:update'), purchaseValidator, updatePurchase);
router.delete('/purchase/:purchaseId', permit('purchase:delete'), deletePurchase);

router.post('/reward', permit('reward:give'), giveReward);
router.delete('/reward/:rewardId', permit('reward:revoke'), revokeReward);

router.patch('/', permit('customer:update'), propertiesValidator, updateCustomerProperties);


module.exports = router;

function updateCustomerProperties(req, res, next) {
    const { userId, businessId } = req.params;
    customerService.updateCustomerProperties(userId, businessId, req.body)
        .then(properties => res.json(properties))
        .catch(err => next(err));
}

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

function giveReward(req, res, next) {
    const { businessId, userId } = req.params;
    customerService.addReward(userId, businessId, req.body)
        .then(data => res.json({ rewards: data }))
        .catch(err => next(err));
}

function revokeReward(req, res, next) {
    const { rewardId, businessId, userId } = req.params;
    customerService.deleteReward(userId, businessId, rewardId)
        .then(data => res.json({ rewards: data }))
        .catch(err => next(err));
}