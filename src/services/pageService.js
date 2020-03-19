const PageData = require('../models/page');
const uploader = require('../helpers/uploader')

module.exports = {
    createPage,
    savePage,
    loadPage,
    getBusinessPageIds,
    uploadHtml,
    getHtmlFile
}

async function createPage(businessId, pageParam) {
    const newPage = new PageData(pageParam);
    newPage.business = businessId;
    return await newPage.save();
}

async function savePage(id, pageData, gjsOnly) {
    const oldPage = await PageData.findById(id);
    // Whether we save the entire document or just what's under 'gjs' key
    if (gjsOnly && gjsOnly !== 'false') {
        // In this case the pageData has gjs-components and gjs-style (root) keys (only what is under 'gjs').
        Object.assign(oldPage.gjs, pageData);
    } else {
        Object.assign(oldPage, pageData);
    }
    return await oldPage.save();
}

async function loadPage(id, gjsOnly) {
    const page = await PageData.findById(id);
    // Whether we load the entire document or just what's under 'gjs' key
    if (gjsOnly && gjsOnly !== 'false') {
        return page.gjs;
    }
    return page;
}

/**
 * Find the given business's pages. The returned pages do not include the "gjs" data.
 * @param {any} businessId the id of the business
 */
async function getBusinessPageIds(businessId) {
    const pages = await PageData.find({ business: businessId }).select('-gjs');
    return pages;
}

async function uploadHtml(pageId, html) {
    await uploader.upload(`page_${pageId}.html`, html);
}

async function getHtmlFile(pageId) {
    return uploader.toPath(`page_${pageId}.html`);
}

