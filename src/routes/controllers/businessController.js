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
    customerService.listCustomers(businessId, limit, searchStr)
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
    // TODO: make sure no one is using this to get their query params and remove lol (?)
    const { business } = req.query;
    if (business) {
        res.json({ business })
    } else {
        // Client can specify with query param "url"
        const url = req.query.url || req.hostname + req.originalUrl
        businessService.getCurrentBusiness(req.user, url)
            .then(res => res.json({ business: res.id }))
            .catch(err => next(err))
    }
}