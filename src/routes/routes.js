const router = require('express').Router();
const users = require('./controllers/usersController');
const purchase = require('./controllers/purchaseController');
const products = require('./controllers/productController');
const campaigns = require('./controllers/campaignController');
const business = require('./controllers/businessController');


const requireLogin = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Forbidden: login required" });
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

router.use('/business', business);
// So we can easily validate permissions with one middleware (using businessId param)
// and admin panel will be easy to implement
router.use('/business/:businessId/campaign', requireLogin, campaigns);
router.use('/business/:businessId/product', requireLogin, products);
router.use('/business/:businessId/purchase', requireLogin, purchase);

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

module.exports = router;