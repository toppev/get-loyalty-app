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

require('dotenv').config();

if (!isTesting) {
    mongoose.connect(process.env.MONGO_URI, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    });
    console.log("Connected to mongo database");
    app.use(morgan('":method :url" :status (len: :res[content-length]) ":user-agent" - :response-time ms',
        { stream: logger.stream }));
}
// If this app is sitting behind a reverse proxy (e.g nginx)
// app.enable('trust proxy')
app.use(cookieParser());
app.use(parser.urlencoded({
    extended: false
}));
app.use(parser.json());

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
require('./src/config/passport');

app.use(require('./src/config/sessionConfig'));
app.use(passport.initialize());
app.use(passport.session());
if (!isTesting) {
    app.use(function (req, res, next) {
        if (req.url === '/user/register' || req.url === '/user/login') {
            return next();
        }
        csurf()(req, res, next);
    });
    app.use(function (err, req, res, next) {
        if (err.code !== 'EBADCSRFTOKEN') return next(err);
        res.cookie('XSRF-TOKEN', req.csrfToken());
        res.status(403);
        res.send({ message: 'session has expired or form tampered' });
    });
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