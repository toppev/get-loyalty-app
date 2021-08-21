import client from "../config/axios"

/**
 * Only returns public data of the published pages.
 * Does not contain the HTML
 */
async function getPages() {
  return client.get(`/page/pages`)
}

async function getPageHtml(pageId: any) {
  return client.get(`/page/${pageId}/html`)
}

async function getPageStaticFile(pageId: any, fileName: string) {
  return client.get(`/page/${pageId}/static/${fileName}`)
}

export {
  getPages,
  getPageHtml,
  getPageStaticFile
}
