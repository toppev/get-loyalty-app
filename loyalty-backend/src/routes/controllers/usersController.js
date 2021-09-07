const router = require('express').Router()
const userService = require('../../services/userService')
const businessService = require('../../services/businessService')
const StatusError = require('../../util/statusError')

const permit = require('../../middlewares/permitMiddleware')
const authenticator = require('../../middlewares/authenticator')
const { verifyCAPTCHA } = require('../../middlewares/captcha')

const validation = require('../../helpers/bodyFilter')
const userValidator = validation.validate(validation.userValidator)

// Not logged in, no perms
router.get('/resetpassword/:token', resetPassword)
router.post('/forgotpassword', forgotPassword)
router.post('/login', authenticator, login)
router.post('/login/:loginService', authenticator, login)
router.post('/register', userValidator, verifyCAPTCHA, register)
// Use the jwt
router.get('/profile', getCurrent)
router.post('/logout', logout)
// With permissions
router.get('/all', permit('user:list'), getAll)
router.patch('/:userId', permit('user:update'), userValidator, update)
router.patch('/', permit('user:update'), userValidator, update)
router.delete('/:userId', permit('user:delete'), deleteUser)
router.get('/:userId', permit('user:get'), getById)

module.exports = router

function login(req, res, next) {
  businessService.getOwnBusiness(req.user)
    .then((businessId) => res.json({
      ...req.user.toJSON(),
      businessOwner: businessId,
    }))
    .catch(err => next(err))
}

/**
 * Creates a new user from the body (taking fields such as email).
 * Logins with the new user and responds with the user as JSON
 */
function register(req, res, next) {
  checkAccepted(req.body)
  userService.create(req.body)
    .then(user => {
      req.login(user, function (err) {
        if (err) {
          return next(err)
        } else {
          res.json(user)
        }
      })
    }).catch(err => next(err))
}

function logout(req, res, next) {
  req.logout()
  req.session = null
  res.json({ success: true })
}

function forgotPassword(req, res, next) {
  userService.forgotPassword(req.body.email)
    .then(() => res.json({
      message: 'A link to reset your password has been emailed if the email exists.'
    }))
    .catch(err => next(err))
}

function resetPassword(req, res, next) {
  userService.resetPassword(req.params.token)
    .then(user => {
      req.login(user, function (err) {
        if (err) {
          return next(err)
        } else {
          const { redirect } = req.query
          if (redirect) {
            res.redirect(redirect)
          } else {
            res.json({ ...user, success: true })
          }
        }
      })
    })
    .catch(err => next(err))
}

function getCurrent(req, res, next) {
  userService.getById(req.user.id)
    .then(user => {
      if (user) {
        userService.markLastVisit(req.user)
          .catch(err => console.log("Failed to update 'lastVisit' in #getCurrent", err))
        businessService.getOwnBusiness(user)
          .then((businessId) => res.json({
            ...user.toJSON(),
            businessOwner: businessId,
          }))
          .catch(err => next(err))
      } else {
        res.sendStatus(404)
      }
    })
    .catch(err => next(err))
}

function update(req, res, next) {
  const id = req.params.userId || req.user.id
  checkAccepted({ ...req.user, ...req.body })
  userService.update(id, req.body)
    .then(user => res.json(user))
    .catch(err => next(err))
}

function deleteUser(req, res, next) {
  const id = req.params.userId
  userService.deleteUser(id)
    .then(() => res.json({}))
    .catch(err => next(err))
}

function getAll(req, res, next) {
  userService.getAll()
    .then(users => res.json(users))
    .catch(err => next(err))
}

function getById(req, res, next) {
  userService.getById(req.params.userId)
    .then(user => user ? res.json(user) : res.sendStatus(404))
    .catch(err => next(err))
}

/** Check the user has accepted ToS and privacy if the data has email address */
function checkAccepted(data) {
  // either acceptAll (boolean) or termsAccepted and privacyPolicyAccepted (dates)
  // Updating the dates works (as long as its newer than the previous value)
  // required if email in the request body (just to be sure we don't forget this)
  if (data.acceptAll || (data.termsAccepted && data.privacyPolicyAccepted)) {
    if (!data.termsAccepted) data.termsAccepted = Date.now()
    if (!data.privacyPolicyAccepted) data.privacyPolicyAccepted = Date.now()
    return
  }
  if (data.email && !data.privacyPolicyAccepted) {
    throw new StatusError('Terms of service and privacy policy must be accepted.', 403)
  }
}
