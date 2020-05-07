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

const businessSchema = new Schema({
    email: {
        type: String,
    },
    config: configSchema,
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
        openingHours: [{
            dayOfWeek: {
                type: String,
                // From monday to sunday
                // min: 1,
                // max: 7
            },
            // String representing open hours (can be custom)
            // e.g 8:00-12:00, 13:00-17:30 or 9-16 or 24/7, basically anything
            hours: {
                type: String,
            },
            validFrom: {
                type: Date,
                default: Date.now
            },
            validThrough: {
                type: Date,
            }
        }],
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