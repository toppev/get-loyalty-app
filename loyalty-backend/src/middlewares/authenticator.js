const passport = require('passport')
const StatusError = require('../util/statusError')


/**
 * Middleware to login using req.params.loginService parameter or 'local' strategy
 */
module.exports = (req, res, next) => {
  const service = req.params.loginService || 'local'

  passport.authenticate(service, function (err, user, info) {
    if (err) return next(err)
    if (!user) throw new StatusError(info.message, 401)

    req.login(user, (e) => {
      if (e) return next(e)
      return next()
    })
  })(req, res, next)
}
