const PageData = require('../models/page');
const uploader = require('../helpers/uploader');
const juice = require('juice');
const pageScreenshot = require('./pageScreenshot');
const fs = require('fs');
const Business = require("../models/business");
const handlebars = require("handlebars");
const StatusError = require('../helpers/statusError');
const customerService = require('./customerService');

module.exports = {
    createPage,
    savePage,
    loadPage,
    getBusinessPages,
    getPublicPage,
    uploadPage,
    getThumbnail,
    getTemplates,
    renderPageView
};

async function createPage(businessId, pageParam) {
    const business = await Business.findById(businessId);
    const limit = business.plan.limits.pages.total;
    if (limit !== -1 && await PageData.countDocuments({
        business: this.business,
        stage: { $ne: 'discarded' }
    }) >= limit) {
        throw new StatusError('Plan limit reached', 402)
    }
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
async function getBusinessPages(businessId) {
    const pages = await PageData.find({ business: businessId }).select('-gjs');
    return pages;
}

/**
 * Return only the ids of the published pages. First should be the home page
 */
async function getPublicPage(businessId) {
    const pages = await PageData.find({
        business: businessId,
        stage: 'published'
    }).sort('pageIndex').select('_id icon pathname');
    return pages;
}

async function uploadPage(pageId, { html, css }) {
    const res = await validateHandlebars(html)
    if (res.error) {
        throw new StatusError(`Invalid placeholders. ${res.error}`, 400)
    }
    // Inline the css
    const tmpl = `${html}<style>${css}</style>`;
    const inlineHtml = juice(tmpl);
    await uploader.upload(`page_${pageId}.html`, inlineHtml);
    // TODO: queue screenshot or something?
    const page = await PageData.findById(pageId);
    if (page) {
        createScreenshot(page.business, pageId)
            .then(() => {
                console.log(`Created or updated page thumbnail of ${pageId}`)
            })
            .catch(err => console.error(`Failed to create a screenshot of ${pageId} page: ${err}`));
    } else {
        console.log(`Page with invalid id was uploaded ${pageId}`);
    }
}

async function validateHandlebars(html) {
    try {
        const template = handlebars.compile(html);
        template({})
    } catch (e) {
        return { error: e };
    }
    return true;
}

async function createScreenshot(businessId, pageId) {
    const pagePath = `/business/${businessId}/page/${pageId}/html`;
    const fileName = `ss_${pageId}`;
    const path = uploader.toPath(`${fileName}.jpg`);
    try {
        await pageScreenshot.takeScreenshot(pagePath, path);
    } catch (err) {
        console.log(`Failed to create a screenshot ${err.message}`);
    }
    return path;
}

/**
 * Get the screenshot file path if it exists, otherwise creates a new screenshot and finally returns it
 * @param {any} pageId the id of the page
 */
async function getThumbnail(pageId) {
    const file = uploader.toPath(`ss_${pageId}.jpg`);
    if (fs.existsSync(file)) {
        return file;
    }
    const page = await PageData.findById(pageId);
    if (page) {
        return await createScreenshot(page.business, pageId);
    }
}

// IDEA: permission/plan based templates?
async function getTemplates() {
    return await PageData.find({ template: true });
}

async function getPageContent(pageId) {
    const path = uploader.toPath(`page_${pageId}.html`);
    return await fs.promises.readFile(path, 'utf8');
}

async function getPageContext(user) {
    const business = await Business.findOne().populate('campaigns products').lean();
    if (business) {
        // All page placeholders
        const userInfo = await customerService.getCustomerInfo(user)
        const customerData = userInfo.customerData;
        const { products, config } = business;

        const campaigns = business.campaigns.map(campaign => {
            // Add currentStamps and stampsNeeded lists so we can actually display stamp icons or something (easily)
            campaign.currentStamps = campaign.getCurrentStamps(customerData);

            const stampsNeeded = campaign.currentStamps - campaign.totalStampsNeeded;
            campaign.stampsNeeded = Array.from({ length: stampsNeeded }, () => ({}));

            return campaign;
        });

        const { translations } = config;
        const points = customerData.properties.points;
        let customerLevels = business.public.customerLevels
        const currentLevel = customerService.getCurrentLevel(customerLevels, points)
        customerLevels = customerLevels.map(lvl => {
            if (currentLevel && lvl.name === currentLevel.name) {
                lvl.active = true
            }
            if (lvl.requiredPoints > points) {
                lvl.pointsNeeded = lvl.requiredPoints - points
            }
            return lvl
        })

        return {
            user: userInfo,
            // Other information about rewards
            customerRewards: {
                unused: customerData.rewards.length,
                used: customerData.usedRewards.length,
            },
            birthdayGreeting: user.isBirthday ? business.config.translations.birthdayGreeting : undefined,
            business: business.public,
            customerLevels,
            currentLevel,
            products,
            campaigns,
            translations
        }
    }
}

async function renderPageView(pageId, businessId, user) {
    const pageHtml = await getPageContent(pageId);
    const context = await getPageContext(user);
    // IDEA: we could precompile when the page is saved, send the precompiled + data to browser
    // browser can compile with handlebars.runtime library
    const template = handlebars.compile(pageHtml);
    return template(context)
}