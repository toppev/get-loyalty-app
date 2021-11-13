import dotenv from "dotenv"
import express from "express"

// @ts-ignore
import errorHandler from "./src/middlewares/errorHandler"
import planUpdater from "./src/config/planUpdateScheduler"
import passportConf from "./src/config/passport"
import logger from "./src/util/logger"
import morgan from "morgan"
import session from "./src/config/sessionConfig"
import routes from "./src/routes/routes"
import cors from "cors"
import cookieParser from "cookie-parser"
import passport from "passport"
import mongoose from "mongoose"
import parser from "body-parser"
import initLevelTask from "./src/tasks/customerLevelTask"

const envFile = process.env.NODE_ENV === "production" ? '.env' : 'dev.env'
console.log(`Loading env vars from "${envFile}"...`)
dotenv.config({
  path: envFile
})

const app = express()
const isTesting = process.env.NODE_ENV === 'test'

if (!isTesting) {
  initLevelTask()

  mongoose.connect(process.env.MONGO_URI || '', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  }, (err) => {
    if (err) throw err
    logger.info("Connected to the mongo database")
    const port = 3001
    app.listen(port, () => {
      logger.info('Listening on port ' + port)
    })
  })
  morgan.token('loggerDate', logger.dateStr)
  app.use(morgan(':loggerDate ":method :url" :status (len: :res[content-length] - :response-time[0] ms) ":user-agent"', {}))
}

app.disable("x-powered-by")
// If this app is sitting behind a reverse proxy (e.g nginx)
// app.enable('trust proxy')
app.use(cookieParser())

const limit = '5mb'
app.use(parser.urlencoded({
  limit: limit,
  extended: false
}))
app.use(parser.json({
  limit: limit,
}))

let frontendOrigin = process.env.APP_ORIGIN || process.env.PUBLIC_URL
if (frontendOrigin && !/https?:\/\//.test(frontendOrigin)) {
  frontendOrigin = `https://${frontendOrigin}`
}
const origins = [
  ...(frontendOrigin ? frontendOrigin.split(',') : ['no_app_origin_set']),
  'https://panel.getloyalty.app',
  'http://localhost:3002',
  'http://localhost:3000' // Just so dev setups can access templates at api.getloyalty.app/...
].map(it => it.startsWith("http") ? it : `https://${it}`)
logger.important(`Allowed origins (${origins.length}): ${origins}`)

app.use(cors(function (req, callback) {
  const origin = req.header('Origin')
  let options
  if (origin && origins.includes(origin)) {
    options = {
      origin: true,
      credentials: true,
    }
  } else {
    options = { origin: false }
  }
  callback(null, options)
}))

passportConf.initConfig()
app.use(session.sessionHandler())
app.use(session.customSessionConfig)
app.use(passport.initialize())
app.use(passport.session())

planUpdater.init()

app.use(routes)
app.use(errorHandler)

export default app
