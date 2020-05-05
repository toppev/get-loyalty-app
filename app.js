const express = require('express');
const app = express();
const parser = require('body-parser');
const routes = require('./src/routes/routes');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const cors = require('cors');
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

require('./src/config/passport');

app.use(require('./src/config/sessionConfig'));
app.use(passport.initialize());
app.use(passport.session());
app.use(routes);
app.use(require('./src/middlewares/errorHandler'));

if (!isTesting) {
    const port = process.env.PORT || 3000;
    app.listen(port, function () {
        console.log('Listening on port ' + port);
    });
}

module.exports = app;