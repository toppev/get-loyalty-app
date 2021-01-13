const mongoose = require('mongoose');
const { Schema } = mongoose;
const rewardSchema = require('./reward');
const defaultCustomerLevels = require('../config/defaultLevels');

const configSchema = new Schema({
    translations: {
        points: {
            singular: {
                type: String,
                default: 'point'
            },
            plural: {
                type: String,
                default: 'points'
            }
        },
        birthdayGreeting: {
            singular: {
                type: String,
                default: 'Happy birthday!'
            }
        },
        qrScanned: {
            singular: {
                type: String,
                default: 'QR code scanned!'
            }
        },
        rewardUsed: {
            singular: {
                type: String,
                default: 'Reward used!'
            }
        },
        scanRegistered: {
            singular: {
                type: String,
                default: 'Done!' // change?
            }
        },
        newReward: {
            singular: {
                type: String,
                default: 'You got a new reward: {0}'
            },
            plural: {
                type: String,
                default: 'You got new rewards: {0}'
            }
        }
    }
});

const planSchema = new Schema({
    // One word. e.g free, trial, custom
    type: {
        type: String,
        default: 'free'
    },
    // Slightly more descriptive/custom name. e.g Early adopter, Moe's custom business plan
    name: {
        type: String,
        default: 'Free plan'
    },
    // FIXME: not implemented/no value set
    expires: {
        type: Date
    },
    // Change free tier levels here (default values)
    // -1 means unlimited
    limits: {
        campaignsActive: {
            type: Number,
            default: 2
        },
        campaignsTotal: {
            type: Number,
            default: 10
        },
        productsTotal: {
            type: Number,
            default: 20
        },
        // Not deleted pages
        pagesActive: {
            type: Number,
            default: 3
        },
        pushNotificationsTotal: {
            type: Number,
            default: 5
        },
        pushNotificationsCooldownMinutes: {
            type: Number,
            default: 2880
        }
    }
})

const customerLevelSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    requiredPoints: {
        type: Schema.Types.Number,
        default: 0,
    },
    // IDEA: background image?
    color: {
        type: String,
    },
    rewards: [rewardSchema]
})

const businessSchema = new Schema({
    email: {
        type: String,
    },
    config: {
        type: configSchema,
        default: {}
    },
    plan: {
        type: planSchema,
        default: {}
    },
    public: {
        name: {
            type: String,
            default: ''
        },
        description: {
            type: String,
            default: ''
        },
        address: {
            type: String,
            default: ''
        },
        // Any website
        website: {
            type: String,
            default: ''
        },
        language: {
            type: String,
            default: 'English'
        },
        // Business categories (pizzeria, barber, coffee shop etc)
        categories: [{
            type: mongoose.Types.ObjectId,
            ref: 'Category',
        }],
        customerLevels: {
            type: [customerLevelSchema],
            default: defaultCustomerLevels
        }
    }
}, {
    // Max collection size is 5MB and only one document is allowed
    capped: true,
    size: 5242880,
    max: 1,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

const Business = mongoose.model('Business', businessSchema);
module.exports = Business;