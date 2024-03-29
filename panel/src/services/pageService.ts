import { DEMO_URL, get, multipartPost, post } from "../config/axios"
import { Page } from "../components/pages/Page"

const STATIC_FILE_TEMPLATE_URL = '/templates/'

function listPages() {
  const subUrl = `/page`
  return get(subUrl + "/list")
}

function createPage(page: Page) {
  const subUrl = `/page`
  // Ignore the _id if it exists
  const { _id, ...data } = page
  return post(subUrl, data)
}

function updatePage(page: Page, gjsOnly: boolean) {
  const subUrl = `/page`
  return post(`${subUrl}/${page._id}/?gjsOnly=${gjsOnly}`, page)
}

function deletePage(page: Page) {
  page.discard()
  return updatePage(page, false)
}

function uploadHtmlCss(page: Page, html: any, css: any) {
  const subUrl = `/page`
  return post(`${subUrl}/${page._id}/upload`, { html, css })
}

function listTemplates() {
  // Get the templates from the demo
  return get(`${DEMO_URL}/api/page/templates`, true)
}

function getPageStaticFile(pageId: any, fileName: string) {
  const subUrl = `/page`
  return get(`${subUrl}/${pageId}/static/${fileName}?nocache=1`) // We can ignore Cloudflare cache if query parameters exists
}

function uploadPageStaticFile(pageId: any, fileName: string, file: any, options?: any) {
  const formData = new FormData()
  formData.append('file', file)
  let query = `?fileName=${fileName}`
  if (options?.toSize) {
    query += "&toWidth=" + options.toSize.width
    query += "&toHeight=" + options.toSize.height
  }
  return multipartPost(`/page/${pageId}/upload-static/${query}`, formData)
}

/**
 * Get the static file if it's already there. Otherwise, return the template (if it exists)
 */
async function getPageStaticFileOrTemplate(pageId: any, fileName: string, templateName?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    getPageStaticFile(pageId, fileName)
      .then(res => resolve(res.data))
      .catch(err => {
        if (err.response.status !== 404) {
          reject(err)
        } else {
          // return the template if non exists yet
          // use fetch for convenience
          fetch(STATIC_FILE_TEMPLATE_URL + (templateName || fileName))
            .then(it => resolve(it.text()))
            .catch(e => reject(e))
        }
      })
  })
}

export {
  listPages,
  listTemplates,
  createPage,
  updatePage,
  deletePage,
  uploadHtmlCss,
  getPageStaticFile,
  uploadPageStaticFile,
  getPageStaticFileOrTemplate,
  STATIC_FILE_TEMPLATE_URL
}
