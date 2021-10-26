require('dotenv').config()
const mongoose = require('mongoose')

const Business = require('../src/models/business')
const defaultCustomerLevels = require('../src/config/defaultLevels')

const readlineSync = require('readline-sync')

console.log(`Connecting to ${process.env.MONGO_URI}`)
mongoose.connect(process.env.MONGO_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}, function (err) {
  if (err) throw err

  const confirm = readlineSync.question('You sure you want to reset default levels? (y/n)')
  if (confirm === 'y' || confirm === 'Y') {

    Business.findOne().then(business => {
      if (!business) {
        console.log('Wtf. Business was not found')
      } else {
        console.log("Just in case you don't know what you're doing here are the current levels before updating")
        console.log(business.public.customerLevels)
        business.public.customerLevels = defaultCustomerLevels
        business.save(() => {
          console.log(business.public.customerLevels)
          console.log('Saved!')
        })
      }
    })
  }


})
