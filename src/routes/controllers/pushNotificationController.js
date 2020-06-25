const router = require('express').Router({ mergeParams: true });
const permit = require('../../middlewares/permitMiddleware');
const pushNotificationService = require('../../services/pushNotificationService');

const validator = require('../../helpers/bodyFilter');
const notificationValidator = validator.validate(validator.pushNotificationValidator);

router.post('/subscribe', subscribe);
router.get('/', permit('notification:list'), getNotifications);
router.post('/', permit('notification:send'), notificationValidator, sendNotifications);

module.exports = router;

function getNotifications(req, res, next) {
    const { businessId } = req.params;
    pushNotificationService.getPushNotificationInfo(businessId)
        .then(result => res.json(result))
        .catch(err => next(err))
}

function sendNotifications(req, res, next) {
    const { businessId } = req.params;
    pushNotificationService.sendPushNotification(businessId, req.body)
        .then(data => res.json({ success: true, ...data }))
        .catch(err => next(err))
}

function subscribe(req, res, next) {
    const { businessId } = req.params;
    pushNotificationService.addSubscription(req.user.id, businessId, req.body)
        .then(() => res.json({ success: true }))
        .catch(err => next(err))
}