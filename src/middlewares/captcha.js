const request = require("request");
const StatusError = require("../helpers/statusError");

function verifyCAPTCHA() {
    return (req, res, next) => {
        const secret = process.env.CAPTCHA_SECRET_KEY;
        const token = req.body.token;
        const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`;

        request.post({ url }, function (error, response, body) {
            if (body.success) {
                next()
            } else {
                throw new StatusError('Invalid CAPTCHA token', 400)
            }
        })
    }

}

module.exports = {
    verifyCAPTCHA
}