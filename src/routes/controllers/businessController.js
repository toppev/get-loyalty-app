const router = require('express').Router();
const businessService = require('../../services/businessService');
const customerService = require('../../services/customerService');
const campaignService = require('../../services/campaignService');
const permit = require('../../middlewares/permitMiddleware');
const validation = require('../../helpers/bodyFilter');
const businessValidator = validation.validate(validation.businessValidator);

router.post('/create', businessValidator, createBusiness);
router.get('/:businessId/public', getPublicInformation);
router.get('/:businessId', permit('business:get'), getBusiness);
router.patch('/:businessId', permit('business:update'), businessValidator, updateBusiness);
router.post('/:businessId/role', permit('business:role'), validation.validate(validation.businessRoleValidator), setUserRole);

router.get('/:businessId/customers', permit('customer:list'), listCustomers);
router.get('/:businessId/reward/list', permit('reward:list'), listRewards);
router.post('/:businessId/reward/all', permit('reward:customers'), rewardCustomers);
// Get the business who owns the current site
router.get('/whois', getWebsiteOwner);

module.exports = router;

function createBusiness(req, res, next) {
    businessService.createBusiness(req.body, req.user.id)
        .then(business => res.json(business))
        .catch(err => next(err));
}

function getBusiness(req, res, next) {
    const id = req.params.businessId;
    businessService.getBusiness(id)
        .then(business => res.json(business))
        .catch(err => next(err));
}

function updateBusiness(req, res, next) {
    const id = req.params.businessId
    businessService.update(id, req.body)
        .then(business => res.json(business))
        .catch(err => next(err));
}

function setUserRole(req, res, next) {
    const id = req.params.businessId;
    const { userId, role } = req.body;
    businessService.setUserRole(id, userId, role)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getPublicInformation(req, res, next) {
    const id = req.params.businessId;
    businessService.getPublicInformation(id)
        .then(data => res.json(data))
        .catch(err => next(err));
}


function listCustomers(req, res, next) {
    const { businessId } = req.params;
    const limit = req.query.limit || 50;
    const searchStr = req.query.search;
    customerService.searchCustomers(businessId, limit, searchStr)
        .then(data => res.json({ customers: data }))
        .catch(err => next(err));
}

function listRewards(req, res, next) {
    const { businessId } = req.params;
    campaignService.getAllRewards(businessId)
        .then(rewards => res.json(rewards))
        .catch(err => next(err))
}

function getWebsiteOwner(req, res, next) {
    const url = req.query.url || req.hostname + req.originalUrl
    businessService.getCurrentBusiness(req.user, url)
        .then(data => res.json({ business: data.id }))
        .catch(err => next(err))
}

function rewardCustomers(req, res, next) {
    const { businessId } = req.params;
    customerService.rewardAllCustomers(businessId, req.body)
        .then(data => res.json(data))
        .catch(err => next(err))
}