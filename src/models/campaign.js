const mongoose = require('mongoose');
const rewardSchema = require('./reward');
const campaignTypes = require('@toppev/loyalty-campaigns');
const { Schema } = mongoose;


const requirementSchema = new Schema({
    type: {
        type: String,
        enum: Object.keys(campaignTypes)
    },
    values: [{
        type: String
    }],
    question: {
        type: String,
        default: function () {
            return campaignTypes[this.type].question;
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
    requirements: [requirementSchema],
    // The code that will give the reward
    // Should be unique
    couponCode: {
        type: String
    },
    // Count total rewards here
    rewardedCount: {
        type: Number,
        default: 0
    },
    maxRewards: {
        // maximum number of rewards
        total: {
            type: Number,
        },
        // per user limit
        user: {
            type: Number,
            default: 1
        },
    },
    // Reward for each purchase (or whatever transaction)
    transactionPoints: {
        type: Schema.Types.Number,
        default: 0
    },
    endReward: [rewardSchema],
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

campaignSchema.pre('save', async function (next) {
    if (this.isModified('couponCode') && this.couponCode) {
        this.couponCode = this.couponCode.toLowerCase()
    }
    next();
});

module.exports = mongoose.model('Campaign', campaignSchema);