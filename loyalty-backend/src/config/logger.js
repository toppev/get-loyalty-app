const { createLogger, format, transports } = require('winston')
const { combine, timestamp, printf } = format

const printfFormat = printf(({ level, message, timestamp: ts }) => `${ts} ${level}: ${message}`)

/** Toggle whether to log to the log files. */
const LOG_FILES = false

const options = {
  file: {
    level: 'info',
    filename: './logs/app.log',
    handleExceptions: true,
    json: false,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
}

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    printfFormat
  ),
  transports: LOG_FILES ? [
    new transports.File(options.file),
    new transports.Console(options.console)
  ] : [
    new transports.Console(options.console)
  ],
  exitOnError: false,
})

logger.stream = {
  write: function (message) {
    logger.info(message)
  },
}

module.exports = logger
