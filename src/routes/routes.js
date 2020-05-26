const router = require('express').Router();
const users = require('./controllers/usersController');
const customer = require('./controllers/customerController');
const products = require('./controllers/productController');
const campaigns = require('./controllers/campaignController');
const business = require('./controllers/businessController');
const category = require('./controllers/categoryController');
const page = require('./controllers/pageController');
const coupon = require('./controllers/couponController');
const scan = require('./controllers/scanController');
const notifications = require('./controllers/pushNotificationController');

// Kinda useless? or is it?
const requireLogin = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: "Forbidden: this route requires logging in" });
}
requireLogin.unless = require('express-unless');

router.use('/user', requireLogin.unless({
    path: [
        new RegExp('/user/login', 'i'),
        new RegExp('/user/register', 'i'),
        new RegExp('/user/resetpassword', 'i'),
        new RegExp('/user/forgotpassword', 'i'),
    ]
}), users);

router.use('/business', requireLogin, business);
router.use('/category', category)
// So we can easily validate permissions with one middleware (using businessId param)
// and admin panel will be easy to implement
router.use('/business/:businessId/campaign', requireLogin, campaigns);
router.use('/business/:businessId/product', requireLogin, products);
// No need to be logged in to view pages
router.use('/business/:businessId/page', page);
router.use('/business/:businessId/customer/:userId', requireLogin, customer);
// Coupon codes
router.use('/business/:businessId/coupon', requireLogin, coupon);
router.use('/business/:businessId/scan', requireLogin, scan)
router.use('/business/:businessId/notifications', requireLogin, notifications)

router.get('/', (req, res) => {
    res.status(200).json({ message: 'Working!' });
});

module.exports = router;