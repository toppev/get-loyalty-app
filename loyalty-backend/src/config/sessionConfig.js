const cookieSession = require('cookie-session');


const sessionName = process.env.DEMO_SERVER === "true" ? 'demo_sessions' : (process.env.SESSION_NAME || 'loyalty_session')
console.log(`Session cookie name: ${sessionName}`)

const sessionHandler = cookieSession({
    name: sessionName,
    expires: new Date(Date.now() + 315569520000), // 10 years lol
    secret: process.env.JWT_SECRET,
    domain: process.env.COOKIE_DOMAIN
});


const domain = "getloyalty.app";

function customSessionConfig(req, res, next) {
    // Fix: the cookie domain of request coming from the panel (etc) won't be sent to api. domain for example
    // Change it from the server (possibly custom) to ours
    let host = req.get('host');
    if (host.endsWith("." + domain)) {
        req.sessionOptions.domain = domain
    }
    next()
}

module.exports = {
    sessionHandler,
    customSessionConfig
}