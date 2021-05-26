const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const campaigns = require('@toppev/getloyalty-campaigns')

const rewardSchema = require('./reward')
const productSchema = require('./product').schema
const { Schema } = mongoose

const purchaseSchema = new Schema({
  categories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category',
  }],
  products: [productSchema],
}, {
  timestamps: true,
})

const userSchema = new Schema({
  email: {
    type: String,
    validate: {
      validator: async function (value) {
        // Allow undefined
        if (!value) {
          return true
        }
        const users = await User.find({ email: value.toLowerCase() }).limit(2)
        return !users.length || (users[0].id === this.id && users.length === 1)
      }, message: 'Email is already taken.',
    },
    index: true
  },
  // The business's news letter subscription
  newsLetter: {
    subscribed: {
      type: Date,
      default: undefined
    }
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    // enum: Object.keys(role.roles),
    enum: ['user', 'business'],
    default: 'user'
  },
  lastVisit: {
    type: Date,
    default: Date.now
  },
  birthday: {
    type: Date
  },
  authentication: {
    // The service used, e.g Facebook/Google
    service: {
      type: String,
    },
    // Service profile
    profile: {
      type: Object,
    },
    lastAttempt: {
      type: Date
    },
    failStreak: {
      type: Number
    },
    // Save JWT loginId so we can deny it in the future if needed
    logins: [{
      loginId: String,
      time: {
        type: Date,
        default: Date.now
      },
    }]
  },
  referrer: {
    type: mongoose.Types.ObjectId,
  },
  referrerFor: [{
    type: mongoose.Types.ObjectId,
  }],
  maxRefers: {
    type: Number,
    default: 1,
  },
  termsAccepted: {
    type: Date,
    validate: {
      validator: (value) => !this.termsAccepted || value > this.termsAccepted,
      message: 'termsAccepted date can not be before the old value',
    },
  },
  privacyPolicyAccepted: {
    type: Date,
    validate: {
      validator: (value) => !this.privacyPolicyAccepted || value > this.privacyPolicyAccepted,
      message: 'privacyPolicyAccepted date can not be before the old value',
    },
  },
  customerData: {
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
    pushNotifications: {
      token: { type: String },
      auth: { type: String },
      endpoint: { type: String },
    },
    // Other customer properties that business can modify freely
    properties: {
      points: {
        type: Number,
        default: 0
      }
    }
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  },
})

userSchema.virtual("hasPassword").get(function () {
  return !!this.password
})

purchaseSchema.methods.populateProducts = function () {
  return this.populate('Product')
}

/**
 * Check whether user can perform the specified operation.
 */
userSchema.methods.hasPermission = async function (operation, params) {
  const userRole = this.role || 'user'
  return role.hasPermission(userRole, operation, params)
}

userSchema.pre('save', async function (next) {
  // only hash if modified (or new)
  if (this.isModified('password') && this.password) {
    if (this.password.length <= 6) {
      throw new Error('Invalid password')
    }
    this.password = await bcrypt.hash(this.password, 12)
  }
  if (this.isModified('email') && this.email) {
    this.email = this.email.toLowerCase()
  }
  next()
})

userSchema.methods.comparePassword = async function (password) {
  return password && await bcrypt.compare(password, this.password)
}

userSchema.methods.isBirthday = function () {
  return campaigns.isBirthday.requirement({ user: this })
}

userSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.password
  return obj
}

const User = mongoose.model('User', userSchema)

module.exports = User

// Because of circular dependencies
// FIXME?
const role = require('./role')
