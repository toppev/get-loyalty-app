import { config } from "dotenv"
import mongoose from "mongoose"
import Page from "../models/page"
import readlineSync from "readline-sync"

config()
console.log(`Connecting to ${process.env.MONGO_URI}`)
// @ts-ignore
mongoose.connect(process.env.MONGO_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}, function (err) {
  if (err) throw err

  Page.find({}).then(pages => {
    pages.forEach(page => {
      console.log(page.id, `(updated ${page.updatedAt})`, `(template: ${page.template})`)
    })


    const pageId = readlineSync.question('Toggle template (ID): ')

    Page.findById(pageId).then(page => {
      if (!page) {
        console.log("Page not found")
      } else {
        page.template = !page.template
        page.save().then(() => {
          // eslint-disable-next-line no-unused-vars
          const { gjs, ...stuff } = page.toObject()
          console.log('Saved:', stuff)
        })
      }
    })

  })

})
