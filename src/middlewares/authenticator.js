const passport = require('passport');


/**
 * Middleware to login using req.params.loginService parameter or 'local' strategy
 */
module.exports = (req, res, next) => {
    const service = req.params.loginService || 'local';
    passport.authenticate(service)(req, res, next);
}