import { Router } from "express"
import Busboy from "busboy"
import businessService from "../../services/businessService"
import customerService from "../../services/customerService"
import campaignService from "../../services/campaignService"
import permit from "../../middlewares/permitMiddleware"
import validation from "../../helpers/bodyFilter"
import fileService from "../../services/fileService"

const router = Router()
const businessValidator = validation.validate(validation.businessValidator)

// Get the business who owns the current site
router.post('/create', businessValidator, createBusiness)
router.get('/public', getPublicInformation)

router.get('/icon', getIcon)
router.post('/icon', permit('business:update'), uploadIcon)

router.get('/', permit('business:get'), getBusiness)
router.patch('/', permit('business:update'), businessValidator, updateBusiness)
router.post('/role', permit('business:role'), validation.validate(validation.businessRoleValidator), setUserRole)

router.get('/customers', permit('customer:list'), listCustomers)
router.get('/reward/list', permit('reward:list'), listRewards)
router.post('/reward/all', permit('reward:customers'), rewardCustomers)

export default router

function createBusiness(req, res, next) {
  businessService.createBusiness(req.body, req.user.id)
    .then(business => res.json(business))
    .catch(err => next(err))
}

function getBusiness(req, res, next) {
  businessService.getBusiness()
    .then(business => business ? res.json(business) : res.status(404).json({ message: 'business not found' }))
    .catch(err => next(err))
}

function updateBusiness(req, res, next) {
  businessService.update(req.body)
    .then(business => res.json(business))
    .catch(err => next(err))
}

function setUserRole(req, res, next) {
  const { userId, role } = req.body
  businessService.setUserRole(userId, role)
    .then(data => res.json(data))
    .catch(err => next(err))
}

function getPublicInformation(req, res, next) {
  businessService.getPublicInformation()
    .then(data => res.json(data))
    .catch(err => next(err))
}

function getIcon(req, res, next) {
  businessService.getIcon(req.query.size)
    .then(file => {
      fileService.serveFile(res, file)
    })
    .catch(err => next(err))
}

function uploadIcon(req, res, next) {
  const fileSizeLimit = 32 // KB
  const busboy = new Busboy({ headers: req.headers, limits: { fileSize: (1024 * fileSizeLimit) } })
  busboy.on('file', function (fieldName, file, filename, encoding, mimetype) {
    file.on('limit', function () {
      res.status(400).json({ message: `Max file size: ${fileSizeLimit}KB` })
    })
    file.on('data', function (data) {
      businessService.uploadIcon(data)
        .then(() => res.json({ success: true }))
        .catch(err => next(err))
    })
  })
  return req.pipe(busboy)
}

function listCustomers(req, res, next) {
  const limit = req.query.limit || 50
  const searchStr = req.query.search
  customerService.searchCustomers(limit, searchStr)
    .then(data => res.json({ customers: data }))
    .catch(err => next(err))
}

function listRewards(req, res, next) {
  campaignService.getAllRewards()
    .then(rewards => res.json(rewards))
    .catch(err => next(err))
}

function rewardCustomers(req, res, next) {
  customerService.rewardAllCustomers(req.body)
    .then(data => res.json(data))
    .catch(err => next(err))
}
