const router = require('express').Router({ mergeParams: true });
const pageService = require('../../services/pageService')
const permit = require('../../middlewares/permitMiddleware');

// Creating a new page
router.post('/', permit('page:create'), createPage);
// Saving
router.post('/:pageId', permit('page:save'), savePage);
// List business's pages
router.get('/list', permit('page:load'), listPages);
// Loading
router.get('/:pageId', permit('page:load'), loadPage);

module.exports = router;

function createPage(req, res, next) {
    pageService.createPage(req.params.businessId, req.body)
        .then((data) => res.json(data))
        .catch(err => next(err));
}


function savePage(req, res, next) {
    pageService.savePage(req.params.pageId, req.body)
        .then(() => res.sendStatus(200))
        .catch(err => next(err));
}

function loadPage(req, res, next) {
    pageService.loadPage(req.params.pageId)
        .then(data => data ? res.json(data) : res.sendStatus(404))
        .catch(err => next(err));
}

function listPages(req, res, next) {
    pageService.getBusinessPageIds(req.params.businessId)
        .then(data => data ? res.json(data) : res.sendStatus(404))
        .catch(err => next(err));
}