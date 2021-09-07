const request = require('request')
const pageService = require('./pageService')
const fileService = require('../services/fileService')
const logger = require("../util/logger")

const PAGE_API_URL = 'https://demo.getloyalty.app/api/page'

/** IDs of the template pages that will be saved initially */
const DEFAULT_PAGES = (process.env.DEFAULT_PAGES || "").split(",")
logger.info(`Template (default) page IDs (${DEFAULT_PAGES.length}): ${DEFAULT_PAGES}`)

async function loadDefaultTemplates() {
  if (!DEFAULT_PAGES.length) return
  try {
    let templates = await getTemplates()
    if (!Array.isArray(templates)) templates = []

    await Promise.all(templates.map(async template => {
      if (DEFAULT_PAGES.includes(template.id)) {
        const page = await pageService.createPage(template)
        // FIXME: dont use html of the demo (wrong placeholders)
        const inlineHtml = await getTemplateSource(page.id)
        await fileService.upload(`page_${page.id}/index.html`, inlineHtml)
        logger.info(`Template ${template.id} loaded`)
      }
    }))
  } catch (e) {
    logger.error(`Failed to load/save default templates`, e)
  }

}

/**
 * Fetch all templates from the API. Returns empty list if it fails
 */
async function getTemplates() {
  return new Promise((resolve, _reject) => {
    // TODO: replace with axios
    request.get(`${PAGE_API_URL}/templates`, {}, (err, _res, body) => {
      if (err) {
        logger.error("Error getting templates", err)
        resolve([])
      } else {
        try {
          resolve(JSON.parse(body))
        } catch (e) {
          logger.error("Error getting templates", e)
          resolve([])
        }
      }
    })
  })

}

/**
 *
 */
async function getTemplateSource(templateId) {
  return new Promise((resolve, reject) => {
    // TODO: replace with axios
    request.get(`${PAGE_API_URL}/${templateId}/html`, {}, (err, _res, body) => {
      if (err) {
        reject(err)
      } else {
        resolve(body)
      }
    })
  })

}

module.exports = {
  loadDefaultTemplates
}
