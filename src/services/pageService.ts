import { BASE_URL, get, getBusinessUrl } from "../config/axios";

/**
 * Only returns public data of the published pages.
 * Does not contain the HTML
 */
function getPages() {
    return get(`${getBusinessUrl()}/page/pages`)
}

function getPageHtmlSource(pageId: any) {
    const pagesURL = process.env.NODE_ENV !== "production" ?
        `${BASE_URL}${getBusinessUrl()}/page` : 'https://pages.getloyalty.app'

    return `${pagesURL}/${pageId}/html`
}

export {
    getPages,
    getPageHtmlSource
}