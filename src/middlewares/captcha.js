const request = require("request");
const StatusError = require("../helpers/statusError");
const User = require("../models/user");

// "IF_EMPTY" to verify only if there are no users yet (e.g creating the first user) (default)
// "ALL" to verify all requests (whatever uses this middleware)
// "DISABLED" to disable
const CAPTCHA_MODES = ["DISABLED", "ALL", "IF_EMPTY"]
const captchaMode = process.env.CAPTCHA_MODE || "IF_EMPTY" // current mode, default ot "IF_EMPTY"
if (CAPTCHA_MODES.includes(captchaMode)) throw Error(`Invalid CAPTCHA_MODE: ${captchaMode}`)

let isEmptyServer;
const checkEmpty = () => {
    User.countDocuments().then(count => {
        isEmptyServer = count === 0
        console.log(`isEmptyServer (no users yet): ${isEmptyServer}`)
    })
}
checkEmpty()

function verifyCAPTCHA(req, res, next) {
    if (process.env.NODE_ENV !== 'test') return next()
    if (captchaMode === "DISABLED" || (captchaMode === "IF_EMPTY" && isEmptyServer)) return next()

    if (isEmptyServer) checkEmpty()

    const secret = process.env.CAPTCHA_SECRET_KEY;
    const token = req.body.token;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`;

    request.post({ url }, function (error, response, body) {
        if (JSON.parse(body).success === true) {
            next()
        } else {
            next(error || new StatusError('Invalid CAPTCHA token', 400))
            console.log("err", error, "response", body, "secret length:", secret.length, "token length:", token)
        }
    })

}

module.exports = {
    verifyCAPTCHA
}