import { Router } from "express"
import users from "./controllers/usersController"
import customer from "./controllers/customerController"
import products from "./controllers/productController"
import campaigns from "./controllers/campaignController"
import business from "./controllers/businessController"
import category from "./controllers/categoryController"
import page from "./controllers/pageController"
import coupon from "./controllers/couponController"
import scan from "./controllers/scanController"
import notifications from "./controllers/pushNotificationController"
import express_unless from "express-unless"

const router = Router()
// Kinda useless? or is it?
const requireLogin = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.status(401).json({ message: "Forbidden: this route requires logging in" })
}
requireLogin.unless = express_unless

router.use('/user', requireLogin.unless({
  path: [
    new RegExp('/user/login', 'i'),
    new RegExp('/user/register', 'i'),
    new RegExp('/user/resetpassword', 'i'),
    new RegExp('/user/forgotpassword', 'i'),
  ]
}), users)

router.use('/business', requireLogin.unless({ path: ['/business/icon'] }), business)
router.use('/category', category)
router.use('/campaign', requireLogin, campaigns)
router.use('/product', requireLogin, products)
router.use('/page', requireLogin.unless({
  path: [
    '/page/templates',
    new RegExp('/page/[a-z0-9]+/html', 'i'),
    new RegExp('/page/[a-z0-9]+/static', 'i')
  ]
}), page)
router.use('/customer/:userId', requireLogin, customer)
// Coupon codes
router.use('/coupon', requireLogin, coupon)
router.use('/scan', requireLogin, scan)
router.use('/notifications', requireLogin, notifications)


const statusData = {
  status: "online",
  onlineSince: new Date()
}

router.get('/ping', (req, res) => {
  res.status(200).json(statusData)
})
router.get('/status', (req, res) => {
  res.status(200).json(statusData)
})

export default router
