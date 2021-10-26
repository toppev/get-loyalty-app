import { Router } from "express"
import pageService from "../../services/pageService"
import permit from "../../middlewares/permitMiddleware"
import validation from "../../helpers/bodyFilter"
import Busboy from "busboy"

const router = Router({ mergeParams: true })
const pageValidator = validation.validate(validation.pageValidator)

// Get templates (no html/css only other data)
router.get('/templates', getTemplates)
// List business's pages
router.get('/list', permit('page:load'), listPages)
// Returns public information of the published pages, no need for permissions
// The customer app uses to list all pages, first should be the homepage
router.get('/pages', listPublicPages)
// Get any html, no perms needed
router.get('/:pageId/html', getHtml)
router.get('/:pageId/static/:fileName', getStaticFile)
// GET for screenshot/thumbnail
router.get('/:pageId/thumbnail', getThumbnail)
// Loading the GJS data
router.get('/:pageId', permit('page:load'), loadPage)
// Uploading html/css (only mongoose validation)
router.post('/:pageId/upload', permit('page:upload'), uploadPage)
// Uploading javascript
router.post('/:pageId/upload-static', permit('page:upload'), uploadStaticFile)
// Saving the GJS raw data
router.post('/:pageId', permit('page:save'), pageValidator, savePage)
// Creating a new page
router.post('/', permit('page:create'), pageValidator, createPage)

export default router

function createPage(req, res, next) {
  pageService.createPage(req.body)
    .then((data) => res.json(data))
    .catch(err => next(err))
}

function savePage(req, res, next) {
  // Whether we save the entire document or just what's under 'gjs' key
  const gjsOnly = req.query.gjsOnly
  // If true req.body should have gjs-components and gjs-style (root) keys (only what is under 'gjs')
  pageService.savePage(req.params.pageId, req.body, gjsOnly)
    .then(() => res.sendStatus(200))
    .catch(err => next(err))
}

function loadPage(req, res, next) {
  // Whether we load the entire document or just what's under 'gjs' key
  const gjsOnly = req.query.gjsOnly
  pageService.loadPage(req.params.pageId, gjsOnly)
    .then(data => data ? res.json(data) : res.sendStatus(404))
    .catch(err => next(err))
}

function listPages(req, res, next) {
  pageService.getBusinessPages()
    .then(data => data ? res.json(data) : res.sendStatus(404))
    .catch(err => next(err))
}

function listPublicPages(req, res, next) {
  pageService.getPublicPage()
    .then(data => res.json(data))
    .catch(err => next(err))
}

function uploadPage(req, res, next) {
  const pageId = req.params.pageId
  pageService.uploadPage(pageId, req.body)
    .then(() => res.sendStatus(200))
    .catch(err => next(err))
}

function getTemplates(req, res, next) {
  pageService.getTemplates()
    .then(data => data ? res.json(data) : res.sendStatus(404))
    .catch(err => next(err))
}

async function getHtml(req, res, next) {
  try {
    const { pageId } = req.params

    // Used in the screenshot/example
    const exampleReward = {
      name: 'Example Reward',
      description: 'An example reward!',
      itemDiscount: '100%',
      customerPoints: 100,
      expires: Date.now()
    }
    const exampleUser = {
      isBirthday: true,
      customerData: {
        purchases: [],
        rewards: [exampleReward],
        usedRewards: [exampleReward],
        properties: { points: 200 }
      },
      authentication: {}
    }

    const user = req.user || exampleUser

    const html = await pageService.renderPageView(pageId, user)
    res.set('Cache-control', 'no-cache')
    res.send(html)
    next()
  } catch (error) {
    next(error)
  }
}

function uploadStaticFile(req, res, next) {
  const fileSizeLimit = 4 // MB
  const busboy = new Busboy({ headers: req.headers, limits: { fileSize: (1024 * 1024 * fileSizeLimit) } })
  busboy.on('file', (fieldName, file, filename, encoding, mimetype) => {
    file.on('limit', () => res.status(400).json({ message: `Max file size: ${fileSizeLimit}MB` }))
    file.on('data', (data) => {
      const pageId = req.params.pageId
      pageService.uploadStaticFile(pageId, data, req.query.fileName, { contentType: mimetype })
        .then(fileId => {
          const fileURL = `${process.env.PUBLIC_URL}/page/${pageId}/static/${fileId}`
          res.json({ success: true, data: [fileURL] })
        })
        .catch(err => next(err))
    })
  })
  return req.pipe(busboy)
}

async function getStaticFile(req, res, next) {
  const pageId = req.params.pageId
  const { fileName } = req.params
  pageService.getStaticFile(pageId, fileName)
    .then(file => serveStatic(res, file))
    .catch(err => next(err))
}

function getThumbnail(req, res, next) {
  const pageId = req.params.pageId
  pageService.getThumbnail(pageId)
    .then(file => serveStatic(res, file))
    .catch(err => next(err))
}

function serveStatic(res, file) {
  if (!file) res.sendStatus(404)
  else {
    res.contentType(file.contentType)
    res.send(file.data)
  }
}
