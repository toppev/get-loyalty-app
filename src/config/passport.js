const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const userService = require('../services/userService');

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    async function (email, password, next) {
        return User.findOne({ email }).then(user => {
            if (user) {
                if (user.authentication.service && user.authentication.service.valueOf() !== 'local') {
                    return next(null, false, { message: 'Incorrect authentication method.' });
                }
                if (!user.password) {
                    return next(null, false, { message: 'No password found.' });
                } else if (user.comparePassword(password)) {
                    return next(null, user, { message: 'Logged in successfully' });
                }
            }
            return next(null, false, { message: 'Incorrect email or password.' });
        }).catch(err => next(err));
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