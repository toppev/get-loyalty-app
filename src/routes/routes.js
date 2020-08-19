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
router.use('/campaign', requireLogin, campaigns);
router.use('/product', requireLogin, products);
router.use('/page', requireLogin.unless({ path: ['/page/templates', new RegExp('/page/[a-z0-9]+/html', 'i')] }), page);
router.use('/customer/:userId', requireLogin, customer);
// Coupon codes
router.use('/coupon', requireLogin, coupon);
router.use('/scan', requireLogin, scan)
router.use('/notifications', requireLogin, notifications)

router.get('/ping', (req, res) => {
    res.status(200).json({ message: 'Success!' });
});

module.exports = router;