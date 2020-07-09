import { get, getBusinessUrl } from "../config/axios";

/**
 * Only returns public data of the published pages.
 * Does not contain the HTML
 */
function getPages() {
    return get(`${getBusinessUrl()}/page/pages`)
}

function getPageHtml(pageId: any) {
    return get(`${getBusinessUrl()}/page/${pageId}/html`)
}

export {
    getPages,
    getPageHtml
}