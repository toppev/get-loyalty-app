import { Router } from "express"
import couponService from "../../services/couponService"
import permit from "../../middlewares/permitMiddleware"
import validation from "../../helpers/bodyFilter"

const router = Router({ mergeParams: true })
const couponValidator = validation.validate(validation.couponValidator)

router.post('/', permit('coupon:create'), couponValidator, createCoupon)
router.patch('/:couponId', permit('coupon:update'), couponValidator, updateCoupon)
router.delete('/:couponId', permit('coupon:delete'), deleteCoupon)
router.get('/list', permit('coupon:list'), getAll)

function createCoupon(req, res, next) {
  couponService.create(req.body)
    .then(coupon => res.json(coupon))
    .catch(err => next(err))
}

function updateCoupon(req, res, next) {
  const couponId = req.params.couponId
  couponService.update(couponId, req.body)
    .then(coupon => res.json(coupon))
    .catch(err => next(err))
}

function deleteCoupon(req, res, next) {
  const couponId = req.params.couponId
  couponService.deleteCoupon(couponId)
    .then(() => res.json({ success: true }))
    .catch(err => next(err))
}

function getAll(req, res, next) {
  couponService.getAllCoupons()
    .then(coupons => res.json(coupons))
    .catch(err => next(err))
}

export default router
