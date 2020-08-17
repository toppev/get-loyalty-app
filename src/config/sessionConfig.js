const cookieSession = require('cookie-session');

module.exports = cookieSession({
    name: 'session',
    expires: new Date(Date.now() + 315569520000), // 10 years lol
    secret: process.env.JWT_SECRET,
    domain: process.env.COOKIE_DOMAIN
});