import { Router } from "express"
import categoryService from "../../services/categoryService"

const router = Router()
// Doesn't really need validation at the moment, categoryService#create makes sure it's not official category
// mongoose handles validating data types/NoSQL injection
router.post('/', createCategory)
router.get('/:categoryId', findById)
router.get('/', find)

export default router

function createCategory(req, res, next) {
  categoryService.create(req.body)
    .then(category => res.json(category))
    .catch(err => next(err))
}

function find(req, res, next) {
  const { query, limit, type } = req.query
  categoryService.find(query, type, limit)
    .then(categories => categories ?
      res.json(categories) : res.sendStatus(404))
    .catch(err => next(err))
}

function findById(req, res, next) {
  categoryService.findById(req.params.categoryId)
    .then(category => res.json(category))
    .catch(err => next(err))
}
