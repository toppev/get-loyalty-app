require('dotenv').config();
const express = require('express');
const app = express();
const parser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const csurf = require('csurf')
const routes = require('./src/routes/routes');

const morgan = require('morgan');
const logger = require('./src/config/logger');

const isTesting = process.env.NODE_ENV === 'test';

if (!isTesting) {
    mongoose.connect(process.env.MONGO_URI, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }, (err) => {
        if (err) throw err;
        console.log("Connected to the mongo database");
        const port = 3001;
        app.listen(port, () => {
            console.log('Listening on port ' + port);
        });
    });
    app.use(morgan('":method :url" :status (len: :res[content-length] - :response-time[0] ms) ":user-agent"', { stream: logger.stream }));
}
// If this app is sitting behind a reverse proxy (e.g nginx)
// app.enable('trust proxy')
app.use(cookieParser());

const limit = '5mb';
app.use(parser.urlencoded({
    limit: limit,
    extended: false
}));
app.use(parser.json({
    limit: limit,
}));

const frontendOrigin = process.env.FRONTEND_ORIGIN || process.env.PUBLIC_URL;
const origins = [frontendOrigin, 'https://panel.getloyalty.app', 'http://localhost:3002'];
console.log(`Allowed origins: ${origins}`);

app.use(cors(function (req, callback) {
    const origin = req.header('Origin')
    let options;
    if (origin && origins.includes(origin)) {
        options = {
            origin: true,
            credentials: true,
        }
    } else {
        options = { origin: false }
    }
    callback(null, options);
}));

require('./src/config/passport');
app.use(require('./src/config/sessionConfig'));
app.use(passport.initialize());
app.use(passport.session());
if (!isTesting) {
    app.use(csurf());
    app.use((req, res, next) => {
        res.cookie('XSRF-TOKEN', req.csrfToken(), { domain: process.env.COOKIE_DOMAIN });
        next()
    });
    app.use((err, req, res, next) => {
        if (err.code !== 'EBADCSRFTOKEN') return next(err)
        // Bypass csrf error on login because the scanner app does not support it (currently)
        if (req.url === '/user/login') {
            return next();
        }
        return next(err)
    });
}
app.use(routes);
app.use(require('./src/middlewares/errorHandler'));

module.exports = app;