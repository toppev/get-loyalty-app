const mongoose = require('mongoose');
const { Schema } = mongoose;

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
    }
});

const planSchema = new Schema({
    // One word. e.g free, trial, custom
    type: {
        type: String
    },
    // Slightly more descriptive/custom name. e.g Early adopter, Moe's custom business plan
    name: {
        type: String,
    },
    expires: {
        type: Date
    },
    // TODO: use these limits
    // Change free tier levels here (default values)
    limits: {
        campaigns: {
            active: {
                type: Number,
                default: 5
            },
            total: {
                type: Number,
                default: 10
            }
        },
        products: {
            total: {
                type: Number,
                default: 20
            }
        },
        pages: {
            total: {
                type: Number,
                default: 3
            }
        }
    }
})

const businessSchema = new Schema({
    email: {
        type: String,
    },
    config: configSchema,
    plan: planSchema,
    public: {
        name: {
            type: String,
        },
        description: {
            type: String,
        },
        address: {
            type: String,
        },
        website: {
            type: String,
        },
        language: {
            type: String
        },
        categories: [{
            type: mongoose.Types.ObjectId,
            ref: 'Category',
        }],
        customerLevels: [{
            name: {
                type: String,
                required: true,
            },
            requiredPoints: {
                type: Schema.Types.Number,
                default: 0,
            }
        }]
    }
});

businessSchema.virtual("campaigns", {
    ref: "Campaign",
    localField: "_id",
    foreignField: "business",
});

businessSchema.virtual("products", {
    ref: "Product",
    localField: "_id",
    foreignField: "business",
});

module.exports = mongoose.model('Business', businessSchema);