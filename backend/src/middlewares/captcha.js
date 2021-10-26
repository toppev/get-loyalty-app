import StatusError from "../util/statusError"
import User from "../models/user"
import logger from "../util/logger"
import axios from "axios"


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

function verifyCAPTCHAOnRegister(req, res, next) {
  if (process.env.NODE_ENV === 'test') return next()
  if (captchaMode === "DISABLED" || (captchaMode === "IF_EMPTY" && !isEmptyServer)) return next()
  if (isEmptyServer) checkEmpty()
  verifyCaptcha(req.body.token)
    .then(next)
    .catch(next)
}

function verifyCAPTCHAOnPasswordReset(req, res, next) {
  if (process.env.NODE_ENV === 'test') return next()
  const pwResetCaptcha = process.env.PASSWORD_RESET_CAPTCHA
  if (!pwResetCaptcha || pwResetCaptcha === 'false') return next()
  verifyCaptcha(req.body.token)
    .then(next)
    .catch(next)
}

async function verifyCaptcha(token) {
  if (!token) throw new StatusError('Empty captcha token', 400)
  const secret = process.env.CAPTCHA_SECRET_KEY
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`
  const res = await axios.post(url,)
  if (res.data.success === true) {
    logger.info("Captcha verified")
  } else {
    logger.important("Captcha validation error", { res: res.data, secretLength: secret?.length, token: token })
    throw new StatusError('Invalid CAPTCHA token', 400)
  }
}

export {
  verifyCAPTCHAOnRegister,
  verifyCAPTCHAOnPasswordReset
}
