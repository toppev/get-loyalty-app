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
    // TODO: should it be like
    // en: ["drink"], fi: ["juoma"]
    // or
    // { lang: "en", translations: ["drink"]}
    translations: {},
    images: [{
        type: String,
        validate: {
            validator: function (value, cb) {
                return validator.isURL(value, { protocols: ['http', 'https'] });
            }, message: 'Invalid URL.',
        },
    }],
});

module.exports = mongoose.model('Category', categorySchema);