const router = require('express').Router({ mergeParams: true });
const campaignService = require('../../services/campaignService')

const permit = require('../../middlewares/permitMiddleware');

const validation = require('../../helpers/bodyFilter');
const campaignValidator = validation.validate(validation.campaignValidator);

router.post('/', permit('campaign:create'), campaignValidator, addCampaign);
router.patch('/:campaignId', permit('campaign:update'), campaignValidator, updateCampaign);
router.delete('/:campaignId', permit('campaign:delete'), deleteCampaign);
router.get('/all', permit('campaign:list'), getAll);
router.get('/:campaignId', permit('campaign:get'), getById);

function addCampaign(req, res, next) {
    const businessId = req.params.businessId;
    campaignService.create(businessId, req.body)
        .then(campaign => res.json(campaign))
        .catch(err => next(err));
}

function updateCampaign(req, res, next) {
    const campaignId = req.params.campaignId;
    campaignService.update(campaignId, req.body)
        .then(campaign => res.json(campaign))
        .catch(err => next(err));
}

function deleteCampaign(req, res, next) {
    const campaignId = req.params.campaignId;
    campaignService.deleteCampaign(campaignId)
        .then(() => res.json({ success: true }))
        .catch(err => next(err));
}

function getById(req, res, next) {
    const campaignId = req.params.campaignId;
    campaignService.getById(campaignId)
        .then(campaign => campaign ? res.json(campaign) : res.sendStatus(404))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    const businessId = req.params.businessId;
    const { populate } = req.query;
    campaignService.getAllByBusinessId(businessId, populate !== undefined ? populate : true)
        .then(campaigns => res.json(campaigns))
        .catch(err => next(err));
}

module.exports = router;