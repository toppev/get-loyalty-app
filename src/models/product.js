const mongoose = require('mongoose');
const { Schema } = mongoose;
const validator = require('validator');

const productSchema = new Schema({
    business: {
        type: mongoose.Types.ObjectId,
        ref: 'Business',
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    categories: [{
        type: mongoose.Types.ObjectId,
        ref: 'Category',
    }],
    images: [{
        type: String,
        validate: {
            validator: function (value, cb) {
                return validator.isURL(value, { protocols: ['http', 'https'] });
            }, message: 'Invalid URL.',
        },
    }],
    price: {
        type: mongoose.Types.Decimal128
    }
});

module.exports = mongoose.model('Product', productSchema);