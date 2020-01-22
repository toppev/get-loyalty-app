const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const resetModel = new Schema({
    // Hashed UUID
    uuid: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

/*
resetModel.pre('save', async function (next) {
    // only hash if modified (or new)
    if (!this.isModified('uuid')) {
        return next();
    }
    this.uuid = await bcrypt.hash(this.uuid, 12);
    next();
});
*/

resetModel.statics.findByUUID = function (uuid, callback) {
    //const hash = bcrypt.hashSync(uuid, 12);
    const hash = uuid;
    return this.findOne({ uuid: hash }, callback);
}

module.exports = mongoose.model('PasswordReset', resetModel);