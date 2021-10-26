import cookieSession from "cookie-session"
import logger from "../util/logger"

const domain = "getloyalty.app"

function sessionHandler() {
  const sessionName = process.env.SESSION_NAME || 'loyalty_session'
  logger.info(`Session cookie name: ${sessionName} (domain: ${domain})`)

  return cookieSession({
    name: sessionName,
    expires: new Date(Date.now() + 315569520000), // 10 years lol
    secret: process.env.JWT_SECRET,
    domain: process.env.COOKIE_DOMAIN
  })

}


function customSessionConfig(req, res, next) {
  // Fix: the cookie domain of request coming from the panel (etc) won't be sent to api. domain for example
  // Change it from the server (possibly custom) to ours
  const host = req.get('host')
  if (host.endsWith("." + domain)) {
    req.sessionOptions.domain = domain
  }
  next()
}

export default {
  sessionHandler,
  customSessionConfig
}
