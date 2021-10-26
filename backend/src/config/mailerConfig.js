export default {
  emailService: process.env.MAILER_SERVICE || "gmail",
  email: process.env.MAILER_EMAIL || "your.email@gmail.com",
  emailPassword: process.env.MAILER_PASSWORD || "password123",
  resetPassword: {
    emailSubject: process.env.MAILER_SUBJECT || "Loyalty App - Reset Password",
    emailText: process.env.MAILER_TEXT || "Here is the link to reset your password: {url}"
  }
}
