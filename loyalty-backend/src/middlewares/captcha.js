const request = require("request")
const StatusError = require("../util/statusError")
const User = require("../models/user")
const logger = require("../util/logger")

// "IF_EMPTY" to verify only if there are no users yet (e.g creating the first user)
// "ALL" to verify all requests (whatever uses this middleware)
// "DISABLED" to disable
const CAPTCHA_MODES = ["DISABLED", "ALL", "IF_EMPTY"]
const captchaMode = process.env.CAPTCHA_MODE || "IF_EMPTY" // current mode, default to "IF_EMPTY"
if (!CAPTCHA_MODES.includes(captchaMode)) throw Error(`Invalid CAPTCHA_MODE: ${captchaMode}`)
if (!process.env.CAPTCHA_SECRET_KEY && process.env.NODE_ENV !== 'test') throw Error('CAPTCHA_SECRET_KEY is missing')

let isEmptyServer
const checkEmpty = () => {
  User.countDocuments().then(count => {
    isEmptyServer = count === 0
    logger.info(`isEmptyServer (no users yet): ${isEmptyServer}`)
  })
}
checkEmpty()

function verifyCAPTCHA(req, res, next) {
  if (process.env.NODE_ENV === 'test') return next()
  if (captchaMode === "DISABLED" || (captchaMode === "IF_EMPTY" && !isEmptyServer)) return next()
  if (isEmptyServer) checkEmpty()

  const token = req.body.token
  if (!token) return next(new StatusError('Empty captcha token', 400))

  const secret = process.env.CAPTCHA_SECRET_KEY
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`

  // TODO replace with axios
  request.post({ url }, function (error, response, body) {
    if (JSON.parse(body).success === true) {
      next()
    } else {
      next(error || new StatusError('Invalid CAPTCHA token', 400))
      logger.important("Captcha validation error", { error, body, secretLength: secret.length, token: token })
    }
  })

}

module.exports = {
  verifyCAPTCHA
}
