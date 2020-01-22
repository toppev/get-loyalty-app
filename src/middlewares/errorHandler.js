const ajv = require('ajv');

function errorHandler(err, req, res, next) {
  console.log(err)
  if (process.env.NODE_ENV == 'development') {
    return res.status(400).json({
      message: err.toString()
    })
  }
  // custom error to send
  if (typeof (err) === 'string') {
    return res.status(400).json({
      message: err
    });
  }
  // mongoose error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: "Database error"
    });
  }
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      message: 'Invalid authentication token'
    });
  }
  if (err.message == 'validation failed') {
    const errorMessage = (ajv.errors || []).map(error => {
      try {
        const [, , fieldName] = /\[(.*)\].(.*)/.exec(error.dataPath);
        return `Error with field "${fieldName}": ${error.message}`;
      } catch (error) {
        return error.message;
      }
    }).join('\n');
    return res.status(401).json({
      message: errorMessage(err)
    });
  }
  return res.status(500).json({
    message: err.message
  });
}

module.exports = errorHandler;