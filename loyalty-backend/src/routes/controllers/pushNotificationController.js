import { Router } from "express"
import permit from "../../middlewares/permitMiddleware"
import pushNotificationService from "../../services/pushNotificationService"
import validator from "../../helpers/bodyFilter"

const router = Router({ mergeParams: true })
const notificationValidator = validator.validate(validator.pushNotificationValidator)

router.post('/subscribe', subscribe)
router.get('/', permit('notification:list'), getNotifications)
router.post('/', permit('notification:send'), notificationValidator, sendNotifications)

export default router

function getNotifications(req, res, next) {
  pushNotificationService.getPushNotificationInfo()
    .then(result => res.json(result))
    .catch(err => next(err))
}

function sendNotifications(req, res, next) {
  pushNotificationService.sendPushNotification(req.body)
    .then(data => res.json({ success: true, ...data }))
    .catch(err => next(err))
}

function subscribe(req, res, next) {
  pushNotificationService.addSubscription(req.user.id, req.body)
    .then(() => res.json({ success: true }))
    .catch(err => next(err))
}
