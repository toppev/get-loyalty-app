import { get } from "../config/axios";

/**
 * Only returns public data of the published pages.
 * Does not contain the HTML
 */
function getPages() {
  return get(`/page/pages`)
}

function getPageHtml(pageId: any) {
  return get(`/page/${pageId}/html`)
}

export {
  getPages,
  getPageHtml
}
