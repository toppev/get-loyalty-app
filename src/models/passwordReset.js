const mongoose = require('mongoose');
const { Schema } = mongoose;

const resetModel = new Schema({
    token: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

resetModel.statics.findByToken = function (token, callback) {
    return this.findOne({ token }, callback);
}

module.exports = mongoose.model('PasswordReset', resetModel);