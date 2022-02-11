import { Router } from "express"
import campaignService from "../../services/campaignService"
import permit from "../../middlewares/permitMiddleware"
import validation from "../../helpers/bodyFilter"
import couponCampaigns from "./couponCampaignController"

const router = Router({ mergeParams: true })
const campaignValidator = validation.validate(validation.campaignValidator)

router.use('/coupon', couponCampaigns)

router.post('/', permit('campaign:create'), campaignValidator, addCampaign)
router.patch('/:campaignId', permit('campaign:update'), campaignValidator, updateCampaign)
router.delete('/:campaignId', permit('campaign:delete'), deleteCampaign)
router.get('/all', permit('campaign:list'), getAll)

function addCampaign(req, res, next) {
  campaignService.create(req.body)
    .then(campaign => res.json(campaign))
    .catch(err => next(err))
}

function updateCampaign(req, res, next) {
  const campaignId = req.params.campaignId
  campaignService.update(campaignId, req.body)
    .then(campaign => res.json(campaign))
    .catch(err => next(err))
}

function deleteCampaign(req, res, next) {
  const campaignId = req.params.campaignId
  campaignService.deleteCampaign(campaignId)
    .then(() => res.json({ success: true }))
    .catch(err => next(err))
}

function getAll(req, res, next) {
  const { populate } = req.query
  campaignService.getAllCampaigns(populate !== undefined ? populate : true)
    .then(campaigns => res.json(campaigns))
    .catch(err => next(err))
}

export default router
