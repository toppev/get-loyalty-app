import mongoose from "mongoose"
import readlineSync from "readline-sync"
import pageService from "../services/pageService"
import { loadDefaultTemplates } from "../services/templateService"

console.log('Connecting....')
// @ts-ignore
mongoose.connect(process.env.MONGO_URI, {
  useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false
}, async function (err) {
  if (err) throw err

  const confirm = readlineSync.question('Mark current pages as deleted? (y/n)')
  if (confirm === 'y' || confirm === 'Y') {
    const pages = await pageService.getBusinessPages()
    for (const page of pages) {
      await pageService.savePage(page.id, { stage: 'discarded' })
      console.log(`Discarded page ${page.id} / ${page.name}`)
    }
    console.log('All pages discarded!')
  }

  console.log('Loading templates....')
  await loadDefaultTemplates()
  console.log("All templates saved!")

})

