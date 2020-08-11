const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const userService = require('../services/userService');

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    async function (email, password, next) {
        email = email.toLowerCase()
        try {
            const user = await User.findOne({ email })
            if (user) {
                if (user.authentication.service && user.authentication.service.valueOf() !== 'local') {
                    return next(null, false, { message: 'Incorrect authentication method.' });
                }
                if (!user.password) {
                    return next(null, false, { message: 'You have not set a password. Please reset your password.' });
                }
                // Put on cooldown if 5 or more failed login attempts
                if (user.authentication.failStreak >= 5) {
                    const lastAttempt = user.authentication.lastAttempt
                    const cooldownLeft = (1000 * 60 * 30) - (lastAttempt ? Date.now() - lastAttempt.getTime() : 0)
                    const cooldownMinutes = cooldownLeft / 60000
                    if (cooldownMinutes > 0) {
                        console.log(`${email} has reached max login attempts (${user.authentication.failStreak}).`)
                        return next(null, false, { message: `Max login attempts reached. Please try again in ${cooldownMinutes} minutes.` });
                    }
                }
                if (await user.comparePassword(password)) {
                    if (user.authentication.failStreak > 0) {
                        user.authentication.failStreak = 0
                        await user.save()
                    }
                    return next(null, user, { message: 'Logged in successfully' });
                }
                // Save failed attempt
                user.authentication.lastAttempt = Date.now()
                if (!user.authentication.failStreak) {
                    user.authentication.failStreak = 1
                } else {
                    user.authentication.failStreak++
                }
                await user.save()
            }
            return next(null, false, { message: 'Incorrect email or password.' });
        } catch (err) {
            next(err)
        }
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    userService.getById(id)
        .then(u => done(null, u))
        .catch(err => done(err, null))
});