const mongoose = require('mongoose');
const { Schema } = mongoose;

const configSchema = new Schema({
    // TODO: config values
});

const businessSchema = new Schema({
    email: {
        type: String,
    },
    config: configSchema,
    public: {
        address: {
            type: String,
        },
        openingHours: [{
            dayOfWeek: {
                type: String,
                // From monday to sunday
                // min: 1,
                // max: 7
            },
            opens: {
                type: String,
            },
            closes: {
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