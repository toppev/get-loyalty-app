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
    // TODO: change?
    requirement: {
        type: String,
    }
});

/**
 * Contains requirements to campaigns.
 * Each requirement may have "func" function that calculates if the requirement is met.
 * If humans are needed to answer the "question" attribute should be specified
 * 
 * Params to functions: values (supplied from database), user, purchase
 */
const campaignRequirements = {
    ifPurchaseGreaterThan: {
        // We don't know the price so ask a human
        // {0} is the value parameter
        question: "Is the price of the purchase more than {0}?"
    },
    ifBirthday: {
        // TODO
        func: function (values, user, purchase) {

        },
    },
    // TODO: more campagin types (e.g. buy x number in x days)
};

const requirementSchema = new Schema({
    requirement: {
        type: String,
        enum: Object.keys(campaignRequirements)
    },
    // TODO: what kinda values or how idk
    values: [{
        type: String
    }],
    question: {
        type: String,
        default: function () {
            return campaignRequirements[this.requirement].question;
        }
    }
});

const campaignSchema = new Schema({
    business: {
        type: mongoose.Types.ObjectId,
        ref: 'Business',
        index: true
    },
    start: {
        type: Date,
        default: Date.now
    },
    end: {
        type: Date
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }],
    categories: [{
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }],
    requirements: [ requirementSchema ],
    // Each purchase's (or whatever) reward as customer points
    transactionPoints: {
        type: Schema.Types.Number,
        default: 0
    },
    endReward: [rewardSchema],
    // TODO: categories?
});


module.exports = mongoose.model('Campaign', campaignSchema);