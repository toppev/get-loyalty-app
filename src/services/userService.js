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

async function forgotPassword(email) {
    const user = await User.findOne({
        email: email
    });
    if (user.authentication.service && user.authentication.service !== 'local') {
        throw new Error('Only users using local authentication can reset their password');
    }
    const userId = user.id;
    if (userId) {
        const buffer = crypto.randomBytes(16);
        const token = buffer.toString('hex');
        console.log(token)
        const reset = new ResetPassword({
            token,
            userId
        });
        await reset.save();
        // TODO: enable
        //emailPasswordReset(email, token);
    }
}

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

async function getAll() {
    return await User.find().select('-password');
}

async function getById(id) {
    return await User.findById(id).select('-password');
}

async function create(userParam) {
    const user = new User(userParam);
    return await user.save();
}

async function update(id, updateParam) {
    const user = await User.findById(id);
    Object.assign(user, updateParam);
    return await user.save();
}

async function deleteUser(id) {
    await User.findByIdAndRemove(id);
}