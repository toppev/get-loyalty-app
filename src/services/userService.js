const User = require('../models/user');
const emailPasswordReset = require('../helpers/mailer');
const ResetPassword = require('../models/passwordReset');
const crypto = require('crypto');

module.exports = {
    getAll,
    getById,
    create,
    update,
    forgotPassword,
    resetPassword,
    deleteUser,
};

/**
 * Finds a user by the given email address. If the user was found, random token is generated and saved (@see {@link ResetPassword}).
 * If the user was not found nothing will be done.
 * Throws and error if the user didn't use local authentication strategy.
 * @param {string} email the user's email address 
 */
async function forgotPassword(email) {
    const user = await User.findOne({
        email: email
    });
    if (user) {
        if (user.authentication.service && user.authentication.service !== 'local') {
            throw new Error('Only users using local authentication can reset their password');
        }
        const userId = user.id;
        if (userId) {
            const buffer = crypto.randomBytes(16);
            const token = buffer.toString('hex');
            const reset = new ResetPassword({
                token,
                userId
            });
            await reset.save();
            // TODO: enable
            //emailPasswordReset(email, token);
        }
    }
}

/**
 * Finds a {@link ResetPassword} by the given token. If the token does not exists,
 * the request was not found or the request has expired an error will be thrown.
 * Otherwise returns the user found by the password reset request.
 * @param {string} token the password reset request token
 */
async function resetPassword(token) {
    if (!token) {
        throw 'No token parameter specified.';
    }
    const request = await ResetPassword.findByToken(token);
    if (!request) {
        throw 'Invalid password reset request link.';
    }
    const minutes = 60;
    if (request.updatedAt < Date.now() - minutes * 60 * 1000) {
        throw 'Password reset request expired.';
    }
    ResetPassword.deleteOne({ id: request.id });
    return await User.findById(request.userId);
}

/**
 * Returns all users (without password hashes)
 */
async function getAll() {
    return await User.find().select('-password');
}

/**
 * Find a user by the given id. Returns the user without password field (password hash) 
 * @param {Any} id the user's _id field 
 */
async function getById(id) {
    return await User.findById(id).select('-password');
}

/**
 * Create a new user with the values from the given object (e.g email, password)
 * @param {Object} userParam 
 */
async function create(userParam) {
    const user = new User(userParam);
    return await user.save();
}

/**
 * Update an existing user
 * @param {Any} id the user's _id field
 * @param {Object} updateParam the object with the values to update
 */
async function update(id, updateParam) {
    const user = await User.findById(id);
    Object.assign(user, updateParam);
    return await user.save();
}

/**
 * Delete the given user from the database
 * @param {Any} id the user's _id field 
 */
async function deleteUser(id) {
    await User.findByIdAndRemove(id);
}