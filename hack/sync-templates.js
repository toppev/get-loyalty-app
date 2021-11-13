const axios = require('axios')
const fs = require('fs')

const client = axios.create({
  baseURL: "https://demo.getloyalty.app/api",
  withCredentials: true,
})

const args = process.argv.slice(2);

const email = args[0]
const password = args[1]
const dryRun = args[2]
;
(async () => {
  console.log("Logging in...")
  const login = await client.post('/user/login', { email, password }, { withCredentials: true })
  console.log("Logged in.")

  const setCookies = login.headers['set-cookie']
  const cookies = setCookies.map(it => it.substring(0, it.indexOf(';') + 1))

  const pageList = await client.get("/page/list", { headers: { Cookie: cookies } })
  const pages = pageList.data
  console.log('Pages found:', pages.map(it => it.id + ': ' + it.pathname + " - " + it.stage))

  const updateHtml = async (pageId, html) => {
    if (dryRun) {
      console.log("dry run: would have updated " + pageId)
    } else {
      await client.post(`/page/${pageId}/upload`, { html }, { headers: { Cookie: cookies } })
    }
  }

  for (const page of pages) {
    const path = `../assets/pages/${page.pathname}.html`
    if (page.stage === "discarded") {
      console.log(`Skipped ${page.pathname}/${page.id}: page is ${page.stage}`)
    } else if (!fs.existsSync(path)) {
      console.log(path, "does not exist")
    } else {
      const html = fs.readFileSync(path, "utf8")
      console.log(`Updating ${page.pathname} from ${path}`)
      await updateHtml(page.id, html)
    }
  }

})().catch(err => console.log(err, err.response?.data))
