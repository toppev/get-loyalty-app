const PageData = require('../models/page');
const uploader = require('../helpers/uploader');
const juice = require('juice');
const pageScreenshot = require('../config/pageScreenshot');
const fs = require('fs');
const Business = require("../models/business");
const handlebars = require("handlebars");

module.exports = {
    createPage,
    savePage,
    loadPage,
    getBusinessPageIds,
    uploadPage,
    getPageContent,
    getScreenshot,
    getTemplates,
    getPageContext,
    renderPageView
};

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

async function uploadPage(pageId, { html, css }) {
    // Inline the css
    const tmpl = `${html}<style>${css}</style>`;
    const inlineHtml = juice(tmpl);
    await uploader.upload(`page_${pageId}.html`, inlineHtml);
    // TODO: should we keep it here?
    const page = PageData.findById(pageId);
    if (page) {
        createScreenshot(page.business, pageId)
            .then(() => {

            })
            .catch(_err => console.error(`Failed to create a screenshot of ${pageId} page`));
    } else {
        console.log(`Page with invalid id was uploaded ${pageId}`);
    }
}

async function createScreenshot(businessId, pageId) {
    const pagePath = `/business/${businessId}/page/${pageId}/html`;
    const fileName = `ss_${pageId}`;
    try {
        await pageScreenshot.takeScreenshot(pagePath, uploader.toPath(fileName));
    } catch (err) {
        console.log(`Failed to create a screenshot ${err}`);
    }
    return fileName;
}

/**
 * Get the screenshot file path if it exists, otherwise creates a new screenshot and finally returns it
 * @param {any} pageId the id of the page
 */
async function getScreenshot(pageId) {
    const file = uploader.toPath(`ss_${pageId}.jpeg`);
    if (fs.existsSync(file)) {
        return file;
    }
    const page = await PageData.findById(pageId);
    if (page) {
        return await createScreenshot(page.business, pageId);
    }
}

// TODO: permission/plan based templates?
async function getTemplates() {
    return await PageData.find({ template: true });
}

async function getPageContent(pageId, callback) {
    // TODO: might use aws s3 or something later
    const path = uploader.toPath(`page_${pageId}.html`);
    return await fs.promises.readFile(path, 'utf8');
}

async function getPageContext(businessId, user) {
    const business = await Business.findById(businessId).populate().lean();
    if (business) {
        // Add all "placeholders" here
        return {
            // FIXME, very hacky
            // without this handlebar can't access fields because of remote code execution prevention (and we don't want RCE)
            user: JSON.parse(JSON.stringify(user)),
            // .lean() fixes it for business
            business: business,
            products: business.products,
            campaigns: business.campaigns
        }
    }
}

async function renderPageView(pageHtml, context) {
    // TODO: handle invalid pageHtml/template
    const template = handlebars.compile(pageHtml);
    return template(context)
}