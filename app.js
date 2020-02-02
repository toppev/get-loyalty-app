const express = require('express');
const app = express();
const parser = require('body-parser');
const routes = require('./src/routes/routes');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser')
const morgan = require('morgan');
const logger = require('./src/config/logger');

require('dotenv').config()

mongoose.connect(process.env.MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});
console.log("Connected to mongo database");

app.use(morgan('":method :url" :status (len: :res[content-length]) ":user-agent" - :response-time ms',
    { stream: logger.stream }));
app.use(cookieParser());
app.use(parser.urlencoded({
    extended: false
}));
app.use(parser.json());

require('./src/config/passport');

app.use(require('./src/config/sessionConfig'));
app.use(passport.initialize());
app.use(passport.session());
app.use(routes);
app.use(require('./src/middlewares/errorHandler'));


// eslint-disable-next-line no-undef
const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, function () {
        console.log('Listening on port ' + port);
    });
}

module.exports = app;