// Every request here has a userId param
// businessController can list customers
import { Router } from "express"
import customerService from "../../services/customerService"
import permit from "../../middlewares/permitMiddleware"
import validation from "../../helpers/bodyFilter"

const router = Router({ mergeParams: true })
const propertiesValidator = validation.validate(validation.customerPropertiesValidator)
const rewardValidator = validation.validate(validation.rewardValidator)

router.post('/rewards', permit('reward:update'), rewardValidator, updateRewards)
router.delete('/reward/:rewardId', permit('reward:revoke'), revokeReward)
router.post('/reward', permit('reward:give'), rewardValidator, giveReward)
router.patch('/properties', permit('customer:update'), propertiesValidator, updateCustomerProperties)
router.get('/', permit('customer:get'), getCustomerData)

export default router

// Rewards
function giveReward(req, res, next) {
  const { userId } = req.params
  customerService.addReward(userId, req.body, true)
    .then(data => res.json({ rewards: data }))
    .catch(err => next(err))
}


function updateRewards(req, res, next) {
  const { userId } = req.params
  customerService.updateRewards(userId, req.body)
    .then(data => res.json({ rewards: data }))
    .catch(err => next(err))
}

function revokeReward(req, res, next) {
  const { rewardId, userId } = req.params
  customerService.deleteReward(userId, rewardId)
    .then(data => res.json({ rewards: data }))
    .catch(err => next(err))
}

// Other stuff
function getCustomerData(req, res, next) {
  const { userId } = req.params
  customerService.getCustomerInfo(userId)
    .then(data => res.json({ customerData: data }))
    .catch(err => next(err))
}

function updateCustomerProperties(req, res, next) {
  const userId = req.params.userId
  customerService.updateCustomerProperties(userId, req.body)
    .then(properties => res.json(properties))
    .catch(err => next(err))
}
