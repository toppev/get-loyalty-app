const mongoose = require('mongoose');
const { Schema } = mongoose;

const PageDataSchema = new Schema({
    business: {
        type: mongoose.Types.ObjectId,
        ref: 'Business',
        index: true
    },
    name: {
        type: String
    },
    gjs: {
        "gjs-components": {
            type: Array
        },
        "gjs-style": {
            type: Array
        },
    },
});

module.exports = mongoose.model('PageData', PageDataSchema);