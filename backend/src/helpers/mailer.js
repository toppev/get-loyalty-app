// See src/config/mailerConfig.js for configuration

import nodemailer from "nodemailer"
import config from "../config/mailerConfig.js"
import logger from "../util/logger"

export {
  emailPasswordReset
}

const transporter = nodemailer.createTransport({
  service: config.emailService,
  auth: {
    user: config.email,
    pass: config.emailPassword
  }
})

async function emailPasswordReset(email, token, redirectUrl) {
  if (process.env.NODE_ENV === 'test') return

  const redirect = redirectUrl || process.env.APP_ORIGIN?.split(',')[0]
  const url = `${process.env.PUBLIC_URL}/user/resetpassword/${token}?redirect=${redirect}`

  const mailOptions = {
    from: config.email,
    to: email,
    subject: config.resetPassword.emailSubject,
    text: config.resetPassword.emailText.replace('{url}', url),
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      logger.error('Failed to email password reset', error)
    } else {
      logger.important('Password reset email was sent to ' + email + '\nInfo: ' + JSON.stringify(info, null, 2))
    }
  })
}
