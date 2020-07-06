const router = require('express').Router();
const Busboy = require('busboy');
const businessService = require('../../services/businessService');
const customerService = require('../../services/customerService');
const campaignService = require('../../services/campaignService');
const permit = require('../../middlewares/permitMiddleware');
const validation = require('../../helpers/bodyFilter');
const businessValidator = validation.validate(validation.businessValidator);

// Get the business who owns the current site
router.post('/create', businessValidator, createBusiness);
router.get('/:businessId/public', getPublicInformation);

router.get('/:businessId/icon', getIcon);
router.post('/:businessId/icon', permit('business:update'), uploadIcon);

router.get('/:businessId', permit('business:get'), getBusiness);
router.patch('/:businessId', permit('business:update'), businessValidator, updateBusiness);
router.post('/:businessId/role', permit('business:role'), validation.validate(validation.businessRoleValidator), setUserRole);

router.get('/:businessId/customers', permit('customer:list'), listCustomers);
router.get('/:businessId/reward/list', permit('reward:list'), listRewards);
router.post('/:businessId/reward/all', permit('reward:customers'), rewardCustomers);

module.exports = router;

function createBusiness(req, res, next) {
    businessService.createBusiness(req.body, req.user.id)
        .then(business => res.json(business))
        .catch(err => next(err));
}

function getBusiness(req, res, next) {
    const id = req.params.businessId;
    businessService.getBusiness(id)
        .then(business => business ? res.json(business) : res.status(404).json({ message: 'business not found' }))
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

function getIcon(req, res, next) {
    const { businessId } = req.params;
    businessService.getIcon(businessId)
        .then(file => file ? res.sendFile(file) : res.sendStatus(404))
        .catch(err => next(err));
}

function uploadIcon(req, res, next) {
    const { businessId } = req.params;
    const busboy = new Busboy({ headers: req.headers });
    busboy.on('file', function (fieldName, file, filename, encoding, mimetype) {
        // TODO: validate type etc?
        file.on('limit', function () {
            res.status(400).json({ message: 'Max file size: 4KB' });
        });
        file.on('data', function (data) {
            businessService.uploadIcon(businessId, data)
                .then(() => res.json({ success: true }))
                .catch(err => next(err));
        });
    });
    return req.pipe(busboy);

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

function rewardCustomers(req, res, next) {
    const { businessId } = req.params;
    customerService.rewardAllCustomers(businessId, req.body)
        .then(data => res.json(data))
        .catch(err => next(err))
}