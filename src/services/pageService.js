const PageData = require('../models/page');

module.exports = {
    createPage,
    savePage,
    loadPage,
    getBusinessPageIds
}

async function createPage(businessId, pageParam) {
    const newPage = new PageData(pageParam);
    newPage.business = businessId;
    return await newPage.save();
}

async function savePage(id, pageData) {
    const oldPage = await PageData.findById(id);
    Object.assign(oldPage, pageData);
    return await oldPage.save();
}

async function loadPage(id) {
    const page = await PageData.findById(id);
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