const passport = require('passport');

module.exports = (req, res, next) => {
    const service = req.params.loginService || 'local';
    passport.authenticate(service)(req, res, next);
}