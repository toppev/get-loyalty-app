import { get, post } from "../config/axios";
import { Page } from "../components/pages/Page";

function listPages() {
    const subUrl = `/page`;
    return get(subUrl + "/list");
}

function createPage(page: Page) {
    const subUrl = `/page`;
    // Ignore the _id if it exists
    const { _id, ...data } = page;
    return post(subUrl, data);
}

function updatePage(page: Page, gjsOnly: boolean) {
    const subUrl = `/page`;
    return post(`${subUrl}/${page._id}/?gjsOnly=${gjsOnly}`, page);
}

function deletePage(page: Page) {
    page.discard()
    return updatePage(page, false)
}

function uploadHtmlCss(page: Page, html: any, css: any) {
    const subUrl = `/page`;
    return post(`${subUrl}/${page._id}/upload`, { html, css });
}

function listTemplates() {
    const subUrl = `/page`;
    return get(`${subUrl}/templates`);
}


export {
    listPages,
    listTemplates,
    createPage,
    updatePage,
    deletePage,
    uploadHtmlCss,
};