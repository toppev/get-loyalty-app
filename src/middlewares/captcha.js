const request = require("request");
const StatusError = require("../helpers/statusError");

const VERIFY_REQUESTS = process.env.NODE_ENV !== 'test'

function verifyCAPTCHA(req, res, next) {
    if (!VERIFY_REQUESTS) return next()
    
    const secret = process.env.CAPTCHA_SECRET_KEY;
    const token = req.body.token;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`;

    request.post({ url }, function (error, response, body) {
        if (JSON.parse(body).success === true) {
            next()
        } else {
            next(error || new StatusError('Invalid CAPTCHA token', 400))
        }
    })

}

module.exports = {
    verifyCAPTCHA
}