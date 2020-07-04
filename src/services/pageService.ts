import { BASE_URL, get, getBusinessUrl } from "../config/axios";
import Page from "../model/Page";

/**
 * Only returns public data of the published pages.
 * Does not contain the HTML
 */
function getPages() {
    return get(`${getBusinessUrl()}/page/pages`)
}

function getPageHtmlSource(page: Page) {
    if (page.externalURL) {
        return page.externalURL
    }
    const pagesURL = process.env.NODE_ENV !== "production" ?
        `${BASE_URL}${getBusinessUrl()}/page` : 'https://pages.getloyalty.app'
    return `${pagesURL}/${page._id}/html`
}

export {
    getPages,
    getPageHtmlSource
}