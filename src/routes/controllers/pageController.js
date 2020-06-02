const router = require('express').Router({ mergeParams: true });
const pageService = require('../../services/pageService');
const permit = require('../../middlewares/permitMiddleware');

// TODO: validate?

// Get templates (no html/css only other data)
router.get('/templates', getTemplates);
// List business's pages
router.get('/list', permit('page:load'), listPages);
// Returns public information of the published pages, no need for permissions
// The customer app uses to list all pages, first should be the homepage
router.get('/pages', listPublicPages);
// Get any html, no perms needed
router.get('/:pageId/html', getHtml);
// GET for screenshot/thumbnail
router.get('/:pageId/thumbnail', getThumbnail);
// Loading the GJS data
router.get('/:pageId', permit('page:load'), loadPage);
// Uploading html pages
router.post('/:pageId/upload', permit('page:upload'), uploadPage);
// Saving the GJS data
// Even though it's a post (because it's easier with grapesjs in frontend) pageService uses Object.assign so partial updates work
router.post('/:pageId', permit('page:save'), savePage);
// Creating a new page
router.post('/', permit('page:create'), createPage);

module.exports = router;

function createPage(req, res, next) {
    pageService.createPage(req.params.businessId, req.body)
        .then((data) => res.json(data))
        .catch(err => next(err));
}

function savePage(req, res, next) {
    // Whether we save the entire document or just what's under 'gjs' key
    const gjsOnly = req.query.gjsOnly;
    // If true req.body should have gjs-components and gjs-style (root) keys (only what is under 'gjs')
    pageService.savePage(req.params.pageId, req.body, gjsOnly)
        .then(() => res.sendStatus(200))
        .catch(err => next(err));
}

function loadPage(req, res, next) {
    // Whether we load the entire document or just what's under 'gjs' key
    const gjsOnly = req.query.gjsOnly;
    pageService.loadPage(req.params.pageId, gjsOnly)
        .then(data => data ? res.json(data) : res.sendStatus(404))
        .catch(err => next(err));
}

function listPages(req, res, next) {
    pageService.getBusinessPages(req.params.businessId)
        .then(data => data ? res.json(data) : res.sendStatus(404))
        .catch(err => next(err));
}

function listPublicPages(req, res, next) {
    pageService.getPublicPage(req.params.businessId)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function uploadPage(req, res, next) {
    const pageId = req.params.pageId;
    pageService.uploadPage(pageId, req.body)
        .then(() => res.sendStatus(200))
        .catch(err => next(err));
}

function getTemplates(req, res, next) {
    pageService.getTemplates()
        .then(data => data ? res.json(data) : res.sendStatus(404))
        .catch(err => next(err));
}

function getThumbnail(req, res, next) {
    const pageId = req.params.pageId;
    pageService.getThumbnail(pageId)
        .then(file => file ? res.sendFile(file) : res.sendStatus(404))
        .catch(err => next(err));
}

async function getHtml(req, res, next) {
    try {
        const { pageId, businessId } = req.params;
        const user = req.user;
        const html = await pageService.renderPageView(pageId, businessId, user);
        res.send(html);
        next();
    } catch (error) {
        next(error);
    }
}