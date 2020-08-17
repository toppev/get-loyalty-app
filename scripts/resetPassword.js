require('dotenv').config();
const mongoose = require('mongoose');

const User = require('../src/models/user');
const userService = require('../src/services/userService');

const readlineSync = require('readline-sync');


mongoose.connect(process.env.MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}, function (err) {
    if (err) throw err;


    const email = readlineSync.question('Email address? ');

    User.find({ email: email }).then(users => {
        const user = users[0];
        if (!user) {
            console.log('User not found.')
        } else {
            const password = readlineSync.question('New password? ');
            userService.update(user.id, { password: password })
            console.log('Password updated.')
        }
    })


})