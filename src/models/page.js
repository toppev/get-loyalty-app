const mongoose = require('mongoose');
const { Schema } = mongoose;

const PageDataSchema = new Schema({
    name: {
        type: String
    },
    pathname: {
        type: String,
        default: function () {
            return this.name.replace(/[^a-zA-Z0-9]/, '')
        }
    },
    // Mainly just for the templates
    description: {
        type: String
    },
    business: {
        type: mongoose.Types.ObjectId,
        ref: 'Business',
        index: true
    },
    // We don't delete pages currently
    // Instead just make them invisible
    stage: {
        type: String,
        enum: ['unpublished', 'published', 'discarded'],
        default: 'unpublished'
    },
    template: {
        type: Boolean
    },
    // ??? is it html?
    icon: {
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
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('PageData', PageDataSchema);