const router = require('express').Router({ mergeParams: true });
const pageService = require('../../services/pageService')
const permit = require('../../middlewares/permitMiddleware');

// Get any html, no perms needed
router.get('/:pageId/html', getHtml);
// List business's pages
router.get('/list', permit('page:load'), listPages);
// Loading the GJS data
router.get('/:pageId', permit('page:load'), loadPage);
// Uploading html pages
router.post('/:pageId/upload', permit('page:upload'), uploadHtml);
// Saving the GJS data
// Even though it's a post (because it's easier with grapesjs in frontend) pageService uses Object.assign so it works like a PATCH
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
    pageService.getBusinessPageIds(req.params.businessId)
        .then(data => data ? res.json(data) : res.sendStatus(404))
        .catch(err => next(err));
}

function uploadHtml(req, res, next) {
    const pageId = req.params.pageId;
    pageService.uploadHtml(pageId, req.body.html)
        .then(() => res.sendStatus(200))
        .catch(err => next(err));
}

function getHtml(req, res, next) {
    const pageId = req.params.pageId;
    pageService.getHtmlFile(pageId)
        .then(file => res.sendFile(file))
        .catch(err => next(err));
}