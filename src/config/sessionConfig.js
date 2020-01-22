const cookieSession = require('cookie-session');

module.exports = cookieSession({
    name: 'session',
    secret: process.env.JWT_SECRET,
    sameSite: 'strict'
});