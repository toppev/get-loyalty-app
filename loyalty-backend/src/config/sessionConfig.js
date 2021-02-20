const cookieSession = require('cookie-session');


const sessionName = process.env.DEMO_SERVER === "true" ? 'demo_sessions' : (process.env.SESSION_NAME || 'loyalty_session')
console.log(`Session cookie name: ${sessionName}`)

module.exports = cookieSession({
    name: sessionName,
    expires: new Date(Date.now() + 315569520000), // 10 years lol
    secret: process.env.JWT_SECRET,
    domain: process.env.COOKIE_DOMAIN
});