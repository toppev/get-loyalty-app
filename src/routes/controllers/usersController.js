const router = require('express').Router();
const userService = require('../../services/userService');
const permit = require('../../middlewares/permitMiddleware');
const authenticator = require('../../middlewares/authenticator');

const validation = require('../../helpers/validation');
const userValidator = validation.validate(validation.userValidator);

// Not logged in, no perms
router.get('/resetpassword/:token', resetPassword);
router.post('/forgotpassword', forgotPassword);
// For convenience
router.post('/login', authenticator, login);
router.post('/login/:loginService', authenticator, login);
// In the same request they can send data (e.g email) therefore we validate the data
router.post('/register', userValidator, register);
// Use the jwt
router.get('/profile', getCurrent);
router.get('/logout', logout);
// With permissions
router.get('/all', permit('user:list'), getAll);
// Patch other if perms?
router.patch('/:userId', permit('user:update'), userValidator, update);
router.delete('/:userId', permit('user:delete'), deleteUser);
router.get('/:userId', permit('user:get'), getById);

module.exports = router;

function login(req, res, next) {
    // So it's easier to get the business id and do stuff on client side
    const businessOwner = req.user.customerData.find(cd => cd.role === 'business').business;
    res.json({...req.user.toJSON(), businessOwner});
}

/**
 * Creates a new user from the body (taking fields such as email).
 * Logins with the new user and responds with the user as JSON
 */
function register(req, res, next) {
    userService.create(req.body)
        .then(user => {
            req.login(user, function (err) {
                if (err) { return next(err); }
                else { res.json(user); }
            });
        }).catch(err => next(err));
}

function logout(req, res, next) {
    req.logout()
    res.json({ success: true });
}

function forgotPassword(req, res, next) {
    userService.forgotPassword(req.body.email)
        .then(() => res.json({
            message: 'A link to reset your password has been emailed if the email exists.'
        }))
        .catch(err => next(err));
}

function resetPassword(req, res, next) {
    userService.resetPassword(req.params.token)
        .then(user => {
            req.login(user, function (err) {
                if (err) {
                    return next(err);
                } else {
                    res.json({ success: true })
                }
            });
        })
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    userService.getById(req.user.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    const id = req.params.userId;
    userService.update(id, req.body)
        .then(user => res.json(user))
        .catch(err => next(err));
}

function deleteUser(req, res, next) {
    const id = req.params.userId;
    userService.deleteUser(id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getById(req, res, next) {
    userService.getById(req.params.userId)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}