const mongoose = require('mongoose');
const { Schema } = mongoose;

const rewardSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    // Either products or categories or both
    // e.g -20% from normal tea and coffee or soft drinks
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }],
    categories: [{
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }],
    // The campaign that rewarded this reward
    campaign: {
        type: Schema.Types.ObjectId,
        ref: 'Campaign'
    },
    // Value e.g "-20%", "2€", "free"
    itemDiscount: {
        type: String,
        required: true
    },
    // Or/and just points
    customerPoints: {
        type: Schema.Types.Number,
        default: 0
    },
    // The business decides
    // e.g "only if meal", "if more than 10€"
    requirement: {
        type: String,
    },
    expires: {
        type: Date
    },
});

module.exports = rewardSchema;
