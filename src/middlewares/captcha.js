const request = require("request");
const StatusError = require("../helpers/statusError");

function verifyCAPTCHA(req, res, next) {
    if (process.env.NODE_ENV === 'test') {
        return next()
    }
    const secret = process.env.CAPTCHA_SECRET_KEY;
    const token = req.body.token;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`;

    request.post({ url }, function (error, response, body) {
        if (JSON.parse(body).success === true) {
            next()
        } else {
            throw new StatusError('Invalid CAPTCHA token', 400)
        }
    })

}

module.exports = {
    verifyCAPTCHA
}