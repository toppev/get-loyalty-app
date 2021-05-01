const StatusError = require("../helpers/statusError")

function errorHandler(err, req, res, _next) {
  if (!(err instanceof StatusError)) console.log(err)
  console.log(`${err.status || 500} - ${err} - ${req.originalUrl} - ${req.method} - ${req.ip}`)
  const status = err.status || 400
  if (process.env.NODE_ENV !== 'production') {
    return res.status(status).json({
      message: err.toString()
    })
  }
  // custom error to send
  if (typeof (err) === 'string') {
    return res.status(status).json({
      message: err
    })
  }
  // mongoose error
  if (err.name === 'ValidationError') {
    return res.status(status).json({
      message: "Database error"
    })
  }
  if (err.name === 'UnauthorizedError') {
    return res.status(err.status || 401).json({
      message: 'Invalid authentication token'
    })
  }
  if (err instanceof StatusError) {
    return res.status(err.status || 400).json({
      message: err.message || 'An error occurred'
    })
  }
  return res.status(err.status || 500).json({
    message: 'An error occurred.'
  })
}

module.exports = errorHandler
