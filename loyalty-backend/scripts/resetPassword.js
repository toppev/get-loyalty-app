require('dotenv').config()
const mongoose = require('mongoose')

const User = require('../src/models/user')
const userService = require('../src/services/userService')

const readlineSync = require('readline-sync')

console.log(`Connecting to ${process.env.MONGO_URI}`)
mongoose.connect(process.env.MONGO_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}, async (err) => {
  if (err) throw err

  const allUsers = await User.find()
  allUsers.forEach(it => it.email && console.log(it.email))

  const email = readlineSync.question('Email address: ')

  const users = await User.find({ email: email })
  const user = users[0]
  if (!user) {
    console.log('User not found.')
  } else {
    const password = readlineSync.question('New password: ')
    userService.update(user.id, { password: password })
      .then(user => console.log(user, 'Password updated.'))
  }

})
