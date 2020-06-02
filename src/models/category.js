const mongoose = require('mongoose');
const { Schema } = mongoose;
const validator = require('validator');

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    parents: [{
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }],
    children: [{
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }],
    keywords: {
        type: [String],
        index: true
    },
    official: {
        type: Boolean
    },
    categoryType: {
        type: String,
        enum: [null, 'business', 'product', 'service']
    },
    // IDEA: translations for categories?
    images: [{
        type: String,
        validate: {
            validator: function (value, cb) {
                return validator.isURL(value, { protocols: ['http', 'https'] });
            }, message: 'Invalid URL.',
        },
    }],
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('Category', categorySchema);