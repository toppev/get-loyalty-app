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
        website: {
            type: String,
            default: '',
            // TODO: check that no one else has entered the website. This will prevent abuse but then they must use the same account?
            // IDEA: trim the url so it will work? e.g no https:// or trailing slashes etc to break it?
            // SEE businessService #getCurrentBusiness and also implement trimming there
            index: true, // Used to get whose site it is
        },
        language: {
            type: String,
            default: 'English'
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
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
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