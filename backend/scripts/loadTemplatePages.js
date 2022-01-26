const templateService = require("../src/services/templateService");
const mongoose = require("mongoose");
const readlineSync = require("readline-sync");
const pageService = require("../src/services/pageService");

console.log('Connecting....')
mongoose.connect(process.env.MONGO_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}, async function (err) {
  if (err) throw err

  const confirm = readlineSync.question('Mark current pages as deleted? (y/n)')
  if (confirm === 'y' || confirm === 'Y') {
    const pages = await pageService.getBusinessPages()
    for (const page in pages) {
      await pageService.savePage(page.id, { stage: 'discarded' })
      console.log(`Discarded page ${page.id} / ${page.name}`)
    }
    console.log('All pages discarded!')
  }

  console.log('Loading templates....')
  await templateService.loadDefaultTemplates()
  console.log("All templates saved!")

})

