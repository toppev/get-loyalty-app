export default {
  emailService: process.env.MAILER_SERVICE || "gmail",
  email: process.env.MAILER_EMAIL || "your.email@gmail.com",
  emailPassword: process.env.MAILER_PASSWORD || "password123",
  resetPassword: {
    emailSubject: process.env.MAILER_SUBJECT || "Loyalty App - Reset Password",
    emailText:
      process.env.MAILER_TEXT || "Here is the link to reset your password:\r\n{url}\r\n\r\nThe link is valid for 1 hour.\r\n\r\nIf you did not request a password reset, you can safely ignore this email."
  }
}
