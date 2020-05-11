const express = require('express');
const app = express();
const parser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const csrf = require('csurf')
const routes = require('./src/routes/routes');

const morgan = require('morgan');
const logger = require('./src/config/logger');

const isTesting = process.env.NODE_ENV === 'test';

require('dotenv').config();

if (!isTesting) {
    mongoose.connect(process.env.MONGO_URI, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log("Connected to mongo database");
}
app.use(morgan('":method :url" :status (len: :res[content-length]) ":user-agent" - :response-time ms',
    { stream: logger.stream }));
app.use(cookieParser());
app.use(parser.urlencoded({
    extended: false
}));
app.use(parser.json());

app.use(cors());
app.options('*', cors({
    // Localhost any port
    origin: [/http:\/\/localhost:[0-9]+$/]
}))
require('./src/config/passport');

app.use(require('./src/config/sessionConfig'));
app.use(passport.initialize());
app.use(passport.session());
if (!isTesting) {
    app.use(csrf())
    app.use(function (err, req, res, next) {
        if (err.code !== 'EBADCSRFTOKEN') return next(err)
        // CSRF error
        res.status(403)
        res.send('session has expired or form tampered')
    })
    app.use(function (req, res, next) {
        res.cookie('XSRF-TOKEN', req.csrfToken())
        next()
    })
}
app.use(routes);
app.use(require('./src/middlewares/errorHandler'));

if (!isTesting) {
    const port = 3001;
    app.listen(port, function () {
        console.log('Listening on port ' + port);
    });
}

module.exports = app;