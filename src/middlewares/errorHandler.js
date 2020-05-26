const ajv = require('ajv');
const logger = require('../config/logger');

function errorHandler(err, req, res, _next) {
    logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    const status = err.status || 400;
    if (process.env.NODE_ENV !== 'production') {
        console.log(err);
        return res.status(status).json({
            message: err.toString()
        })
    }
    // custom error to send
    if (typeof (err) === 'string') {
        return res.status(status).json({
            message: err
        });
    }
    // mongoose error
    if (err.name === 'ValidationError') {
        return res.status(status).json({
            message: "Database error"
        });
    }
    if (err.name === 'UnauthorizedError') {
        return res.status(err.status || 401).json({
            message: 'Invalid authentication token'
        });
    }
    if (err.message == 'validation failed') {
        const errorMessage = (ajv.errors || []).map(error => {
            try {
                const [, , fieldName] = /\[(.*)\].(.*)/.exec(error.dataPath);
                return `Error with field "${fieldName}": ${error.message}`;
            } catch (e) {
                return e.message;
            }
        }).join('\n');
        return res.status(err.status || 401).json({
            message: errorMessage(err)
        });
    }
    return res.status(err.status || 500).json({
        message: err.message
    });
}

module.exports = errorHandler;