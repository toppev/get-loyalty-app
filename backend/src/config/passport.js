import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"
import User from "../models/user"
import userService from "../services/userService"
import logger from "../util/logger"

export default { initConfig }

function initConfig() {

  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, async function (email, password, next) {
    email = email.toLowerCase()
    try {
      const user = await User.findOne({ email })
      if (user) {
        if (user.authentication.service && user.authentication.service.valueOf() !== 'local') {
          return next(null, false, { message: 'Incorrect authentication method.' })
        }
        if (!user.password) {
          return next(null, false, { message: 'You have not set a password. Please reset your password.' })
        }
        // Put on cooldown if 5 or more failed login attempts
        if (user.authentication.failStreak >= 5) {
          const lastAttempt = user.authentication.lastAttempt
          const cooldownLeft = (1000 * 60 * 30) - (lastAttempt ? Date.now() - lastAttempt.getTime() : 0)
          const cooldownMinutes = cooldownLeft / 60000
          if (cooldownMinutes > 0) {
            logger.important(`${email} has reached max login attempts (${user.authentication.failStreak}).`)
            return next(null, false, { message: `Max login attempts reached. Please try again in ${cooldownMinutes} minutes.` })
          }
        }
        if (await user.comparePassword(password)) {
          if (user.authentication.failStreak > 0) {
            user.authentication.failStreak = 0
            await user.save()
          }
          return next(null, user, { message: 'Logged in successfully' })
        }
        // Save failed attempt
        user.authentication.lastAttempt = new Date()
        if (!user.authentication.failStreak) {
          user.authentication.failStreak = 1
        } else {
          user.authentication.failStreak++
        }
        await user.save()
      }
      return next(null, false, { message: 'Incorrect email or password.' })
    } catch (err) {
      next(err)
    }
  }
  ))

  passport.serializeUser(async (user, done) => {
    user.authentication.logins.push({})
    await user.save()
    done(null, { id: user.id, timestamp: Date.now(), role: user.role })
  })

  passport.deserializeUser((serialized, done) => {
    userService.getById(serialized.id || serialized)
      .then(u => done(null, u))
      .catch(err => done(err, null))
  })

}
