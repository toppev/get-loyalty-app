const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    business: {
        type: mongoose.Types.ObjectId,
        ref: 'Business',
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true,
    },
    sent: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PushNotification', productSchema);