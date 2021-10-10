const pageService = require('./pageService')
const logger = require("../util/logger")
const axios = require("axios")

const PAGE_API_URL = 'https://demo.getloyalty.app/api/page'

/** IDs of the template pages that will be saved initially */
const DEFAULT_PAGES = (process.env.DEFAULT_PAGES || "").split(",")
logger.info(`Template (default) page IDs (${DEFAULT_PAGES.length}): ${DEFAULT_PAGES}`)

async function loadDefaultTemplates(pageIds = DEFAULT_PAGES) {
  try {
    const templateData = await getTemplateData()
    let { templates, common } = templateData
    if (!Array.isArray(templates)) templates = []

    // Pages
    await Promise.all(templates.map(async template => {
      if (pageIds.includes(template.page.id)) {
        const page = await pageService.createPage(template)
        if (template.uploads?.length) {
          await cloneUploads(template.uploads, page.id)
        }
        logger.info(`Template ${template.page.id} loaded`)
      }
    }))

    // Common files
    await cloneUploads(common?.uploads || [], 'common')
  } catch (e) {
    logger.error(`Failed to load/save default templates`, e)
  }

}

/**
 * Fetch all templates from the API. Returns empty list if it fails
 */
async function getTemplateData() {
  try {
    const res = await axios.get(`${PAGE_API_URL}/templates`)
    return res.data
  } catch (err) {
    logger.error("Error getting templates", err)
  }
  return []
}

async function cloneUploads(uploads, pageId) {
  await Promise.all(uploads.map(async entry => {
    const actualFileName = entry._id.toString().split('/').pop()
    await pageService.uploadStaticFile(
      pageId,
      entry.data,
      actualFileName,
      { contentType: entry.contentType }
    )
    logger.info(`Cloned upload ${actualFileName} (${entry.contentType}) for the page ${pageId}`)
  }))
}

module.exports = {
  loadDefaultTemplates,
}
