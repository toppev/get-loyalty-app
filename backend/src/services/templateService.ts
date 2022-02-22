import pageService from "./pageService"
import logger from "../util/logger"
import axios from "axios"
import { IPage } from "../models/page"

const PAGE_API_URL = 'https://demo.getloyalty.app/api/page'

/** IDs of the template pages that will be saved initially */
const DEFAULT_PAGES = (process.env.DEFAULT_PAGES || "").split(",")
logger.info(`Template (default) page IDs (${DEFAULT_PAGES.length}): ${DEFAULT_PAGES}`)

async function loadDefaultTemplates(pageIds = DEFAULT_PAGES) {
  try {
    logger.important(`Loading default template pages: ${pageIds}`)

    const templateData = await getTemplateData()
    if (!templateData) return
    const { templates, common } = templateData

    // Pages
    await Promise.all(templates.map(async template => {
      const { page } = template
      if (pageIds.includes(page.id)) {
        await pageService.createPage({ ...page, fromTemplate: page.id, uploads: template.uploads })
        logger.info(`Template ${page.name} loaded`)
      }
    }))

    // Common files
    await pageService.cloneUploads(common?.uploads || [], 'common')
  } catch (e) {
    logger.error(`Failed to load/save default templates`, e)
  }

}

/**
 * Fetch all templates from the API. Returns empty list if it fails
 */
async function getTemplateData(): Promise<TemplateData | undefined> {
  try {
    const res = await axios.get(`${PAGE_API_URL}/templates`)
    return res.data
  } catch (err) {
    logger.error("Error getting templates", err)
  }
}

interface TemplateData {
  templates: Template[]
  common: {
    uploads: any[]
  }
}

interface Template {
  page: IPage
  uploads: []
}

export {
  loadDefaultTemplates,
}
