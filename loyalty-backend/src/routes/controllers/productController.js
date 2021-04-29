const router = require('express').Router()
const productService = require('../../services/productService')
const permit = require('../../middlewares/permitMiddleware')

const validation = require('../../helpers/bodyFilter')
const productValidator = validation.validate(validation.productValidator)

router.post('/', permit('product:create'), productValidator, addProduct)
router.patch('/:productId', permit('product:update'), productValidator, updateProduct)
router.delete('/:productId', permit('product:delete'), deleteProduct)
router.get('/all', permit('product:list'), getAll)
router.get('/:productId', permit('product:get'), getById)

module.exports = router

function addProduct(req, res, next) {
  productService.create(req.body)
    .then(product => res.json(product))
    .catch(err => next(err))
}

function updateProduct(req, res, next) {
  const productId = req.params.productId
  productService.update(productId, req.body)
    .then(product => res.json(product))
    .catch(err => next(err))
}

function deleteProduct(req, res, next) {
  const productId = req.params.productId
  productService.deleteProduct(productId)
    .then(() => res.json({}))
    .catch(err => next(err))
}

function getById(req, res, next) {
  const productId = req.params.productId
  productService.getById(productId)
    .then(product => product ? res.json(product) : res.sendStatus(404))
    .catch(err => next(err))
}

function getAll(req, res, next) {
  const { populate } = req.query
  productService.getAllProducts(populate !== undefined ? populate : true)
    .then(products => res.json(products))
    .catch(err => next(err))
}
