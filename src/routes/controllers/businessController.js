const router = require('express').Router();
const businessService = require('../../services/businessService');
const permit = require('../../middlewares/permitMiddleware');
const validation = require('../../helpers/validation');
const businessValidator = validation.validate(validation.businessValidator);

router.post('/create', businessValidator, createBusiness);
router.get('/:businessId/public', getPublicInformation);
router.get('/:businessId', permit('business:get'), getBusiness);
router.patch('/:businessId', permit('business:update'), businessValidator, updateBusiness);
router.post('/:businessId/role', permit('business:role'), validation.validate(validation.businessRoleValidator), setUserRole);

router.get('/:businessId/customers', permit('customer:list'), listCustomers); // TODO test

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
    res.status(501).send()
    // TODO: implement
    /*
    customerService.listCustomers(businessId)
        .then(data => res.json({ customerData: data }))
        .catch(err => next(err));
     */
}