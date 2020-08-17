const request = require('request');
const pageService = require('./pageService');
const uploader = require('../helpers/uploader');

const PAGE_API_URL = 'https://api.getloyalty.app/page';

/** IDs of the template pages that will be saved initially */
const TEMPLATE_IDS = []

async function loadDefaultTemplates() {
    if (!TEMPLATE_IDS.length) return;
    try {
        let templates = await getTemplates();
        if (!Array.isArray(templates)) templates = []

        await Promise.all(templates.map(template => {
            if (TEMPLATE_IDS.includes(template.id)) {
                return (async () => {
                    const page = await pageService.createPage(template);
                    const inlineHtml = await getTemplateSource(page.id);
                    await uploader.upload(`page_${page.id}`,`index.html`, inlineHtml);
                })
            }
        }))
    } catch (e) {
        console.log(`Failed to load/save default templates: ${e}`)
    }

}

/**
 * Fetch all templates from the API
 */
async function getTemplates() {
    return new Promise((resolve, reject) => {
        request.get(`${PAGE_API_URL}/templates`, {}, (err, _res, body) => {
            if (err) {
                reject(err)
            } else {
                resolve(body)
            }
        });
    })

}

/**
 *
 */
async function getTemplateSource(templateId) {
    return new Promise((resolve, reject) => {
        request.get(`${PAGE_API_URL}/${templateId}/html`, {}, (err, _res, body) => {
            if (err) {
                reject(err)
            } else {
                resolve(body)
            }
        });
    })

}

module.exports = {
    loadDefaultTemplates
}