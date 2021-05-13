import { get } from "../config/axios"

/**
 * Only returns public data of the published pages.
 * Does not contain the HTML
 */
async function getPages() {
  return get(`/page/pages`)
}

async function getPageHtml(pageId: any) {
  return get(`/page/${pageId}/html`)
}

async function getPageStaticFile(pageId: any, fileName: string) {
  return get(`/page/${pageId}/static/${fileName}`)
}

export {
  getPages,
  getPageHtml,
  getPageStaticFile
}
