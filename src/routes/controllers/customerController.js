const router = require('express').Router({ mergeParams: true });
const customerService = require('../../services/customerService')
const permit = require('../../middlewares/permitMiddleware');

const validation = require('../../helpers/validation');
const purchaseValidator = validation.validate(validation.purchaseValidator);
const propertiesValidator = validation.validate(validation.customerPropertiesValidator);

router.patch('/customer/:userId', permit('customer:update'), propertiesValidator, updateCustomerProperties);

router.post('/purchase/', permit('purchase:create'), purchaseValidator, newPurchase);
router.patch('/purchase/:purchaseId', permit('purchase:update'), purchaseValidator, updatePurchase);
router.delete('/purchase/:purchaseId', permit('purchase:delete'), deletePurchase);

module.exports = router;

function updateCustomerProperties(req, res, next) {
    const userId = req.params.userId;
    customerService.updateCustomerProperties(userId, req.params.businessId, req.body)
        .then(properties => res.json(properties))
        .catch(err => next(err));
}

function newPurchase(req, res, next) {
    const businessId = req.params.businessId;
    // userId doesn't need validation, it's always only for this business
    const userId = req.body.userId;
    customerService.addPurchase(userId, businessId, req.body)
        .then(purchases => res.json(purchases))
        .catch(err => next(err));
}

function updatePurchase(req, res, next) {
    const purchaseId = req.params.purchaseId;
    customerService.updatePurchase(purchaseId, req.body)
        .then(purchase => res.json(purchase))
        .catch(err => next(err));
}

function deletePurchase(req, res, next) {
    const purchaseId = req.params.purchaseId;
    customerService.deletePurchase(purchaseId)
        .then(() => res.json({}))
        .catch(err => next(err));
}