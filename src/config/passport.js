const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
    async function (email, password, next) {
        return User.findOne({ email }).then(user => {
            // TODO: only if they didn't use oauth2
            if (user) {
                if (!user.password) {
                    return next(null, false, { message: 'No password found.' });
                }
                else if (user.comparePassword(password)) {
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
    User.findById(id, function (err, user) {
        done(err, user);
    });
});