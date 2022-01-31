import { config } from "dotenv"
import mongoose from "mongoose"
import User from "../models/user"
import userService from "../services/userService"
import readlineSync from "readline-sync"

config()
console.log(`Connecting to ${process.env.MONGO_URI}`)
// @ts-ignore
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
