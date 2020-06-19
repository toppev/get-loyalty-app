const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const campaigns = require('@toppev/loyalty-campaigns');

const rewardSchema = require('./reward');
const productSchema = require('./product').schema;
const { Schema } = mongoose;

const purchaseSchema = new Schema({
    categories: [{
        type: Schema.Types.ObjectId,
        ref: 'Category',
    }],
    products: [productSchema],
}, {
    timestamps: true,
});

const userSchema = new Schema({
    email: {
        type: String,
        validate: {
            validator: async function (value) {
                // Allow undefined
                if (!value) {
                    return true;
                }
                const users = await User.find({ email: value }).limit(2);
                return !users.length || (users[0].id === this.id && users.length === 1);
            }, message: 'Email is already taken.',
        },
        index: true
    },
    password: {
        type: String,
    },
    // Super user role
    // e.g site admin
    // Has permission to modify everything
    superRole: {
        type: String,
        enum: [null, 'admin']
    },
    lastVisit: {
        type: Date,
        default: Date.now
    },
    birthday: {
        type: Date
    },
    authentication: {
        // The service used
        service: {
            type: String,
        },
        profile: {
            type: Object,
        }
    },
    customerData: [{
        // no _id field
        _id: false,
        // identify by business
        business: {
            type: Schema.Types.ObjectId,
            ref: 'Business'
        },
        role: {
            type: String,
            // only user or business
            // enum: Object.keys(role.roles),
            enum: ['user', 'business'],
            default: 'user'
        },
        purchases: [purchaseSchema],
        rewards: [rewardSchema],
        usedRewards: [{
            dateUsed: {
                type: Date,
                default: Date.now
            },
            reward: {
                type: rewardSchema,
                required: true
            }
        }],
        // Other customer properties that business can modify freely
        properties: {
            points: {
                type: Number,
                default: 0
            }
        }
    }],
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

userSchema.virtual("hasPassword").get(function () {
    return !!this.password;
});

purchaseSchema.methods.populateProducts = function () {
    return this.populate('Product');
};

userSchema.methods.customerDataByBusiness = async function (business) {
    const id = business.id || business;
    return this.customerData.find(data => data.business.equals(id));
};

/**
 * Check whether user can perform the specified operation.
 */
userSchema.methods.hasPermission = async function (operation, params) {
    // If superRole is set use it otherwise defaults to 'user'
    let userRole = this.superRole || 'user';
    const businessId = params.reqParams.businessId;
    // and check if they have a greater role in the given business
    if (userRole == 'user' && businessId) {
        const data = await this.customerDataByBusiness(businessId);
        if (data && data.role) {
            userRole = data.role;
        }
    }
    const result = await role.can(userRole, operation, { businessId, ...params })
        .catch(err => {
            throw err;
        });
    return result;
};

userSchema.pre('save', async function (next) {
    // only hash if modified (or new)
    if (this.isModified('password') && this.password) {
        if (this.password.length <= 6) {
            throw new Error('Invalid password')
        }
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

userSchema.methods.comparePassword = function (password) {
    return password && bcrypt.compareSync(password, this.password);
};

userSchema.methods.isBirthday = function () {
    return campaigns.isBirthday.requirement({ user: this })
}

userSchema.methods.toJSON = function () {
    let obj = this.toObject();
    delete obj.password;
    return obj;
};

const User = mongoose.model('User', userSchema);

module.exports = User;

// Because of circular dependencies
// FIXME?
var role = require('./role');