import { get, BASE_URL } from "../config/axios";

/**
 * Only returns public data of the published pages.
 * Does not contain the HTML
 */
function getPages() {
    return get(`${BASE_URL}/page/pages`)
}

function getPageHtml(pageId: any) {
    return get(`${BASE_URL}/page/${pageId}/html`)
}

export {
    getPages,
    getPageHtml
}