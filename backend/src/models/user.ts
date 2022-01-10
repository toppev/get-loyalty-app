import logger from "../util/logger"
import Category from "./category"
import { Document, model, Schema } from "mongoose"
import bcrypt from "bcrypt"
import campaigns from "@toppev/getloyalty-campaigns"
import rewardSchema from "./reward"
import product from "./product"

// Because of circular dependencies
// FIXME?
import role from "./role"

logger.debug(`Making sure ${Category.baseModelName} is loaded before user schema`)

export interface IUser {
  email?: string
  newsLetter: { subscribed?: Date }
  password?: string
  /** Virtua field */
  hasPassword: boolean
  /** Virtua field */
  createdAt: Date
  role: "user" | "business"
  lastVisit: Date
  birthday?: Date
  authentication: {
    service: string | undefined
    profile: any | undefined
    lastAttempt: Date | undefined
    failStreak: number
    logins: { time: Date }[]
  },
  referrer: string | undefined
  referrerFor: Schema.Types.ObjectId[]
  maxRefers: number
  termsAccepted: Date | undefined
  privacyPolicyAccepted: Date | undefined
  customerData: {
    purchases: PurchaseDocument[] // TODO: type
    rewards: any[] // TODO: type
    usedRewards: {
      dateUsed: Date
      reward: any // TODO: type
    }[],
    pushNotifications: {
      token: string
      auth: string
      endpoint: string
    },
    customerLevel: {
      currentLevel: any
      since: Date
    }
    properties: {
      points: number
    }
  }

  comparePassword(password: string): Promise<boolean>
}

export interface UserDocument extends IUser, Document {
}

export interface IPurchase {
  categories: Schema.Types.ObjectId[],
  products: any[]
}

export interface PurchaseDocument extends IPurchase, Document {
}

const purchaseSchema = new Schema<PurchaseDocument>({
  categories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category',
  }],
  products: [product.schema],
}, {
  timestamps: true,
})

const userSchema = new Schema<UserDocument>({
  email: {
    type: String,
    validate: {
      validator: async function (this: UserDocument, value) {
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
    // Save JWT login (with id) so we can deny it in the future if needed
    logins: [{
      time: {
        type: Date,
        default: Date.now
      },
    }]
  },
  referrer: {
    type: Schema.Types.ObjectId,
  },
  referrerFor: [{
    type: Schema.Types.ObjectId,
  }],
  maxRefers: {
    type: Number,
    default: 1,
  },
  termsAccepted: {
    type: Date,
    validate: {
      validator: function (this: UserDocument, value) {
        return !this.termsAccepted || value >= this.termsAccepted
      },
      message: 'termsAccepted date can not be before the old value',
    },
  },
  privacyPolicyAccepted: {
    type: Date,
    validate: {
      validator: function (this: UserDocument, value) {
        return !this.privacyPolicyAccepted || value >= this.privacyPolicyAccepted
      },
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
    customerLevel: {
      since: { type: Date, default: Date.now }
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

userSchema.virtual("hasPassword").get(function (this: UserDocument) {
  return !!this.password
})

purchaseSchema.methods.populateProducts = function (this) {
  return this.populate('Product')
}

/**
 * Check whether user can perform the specified operation.
 */
userSchema.methods.hasPermission = async function (this: UserDocument, operation, params) {
  const userRole = this.role || 'user'
  return role.hasPermission(userRole, operation, params)
}

userSchema.pre<UserDocument>('save', async function (next) {
  // only hash if modified (or new)
  if (this.isModified('password') && this.password) {
    if (this.password.length <= 6) {
      throw new Error('Invalid password')
    }
    // @ts-ignore
    this.password = await bcrypt.hash(this.password, 12)
  }
  if (this.isModified('email') && this.email) {
    this.email = this.email.toLowerCase()
  }
  next()
})

userSchema.methods.comparePassword = async function (this: UserDocument, password) {
  // @ts-ignore
  return password && await bcrypt.compare(password, this.password)
}

userSchema.methods.isBirthday = function (this: UserDocument) {
  // @ts-ignore
  return campaigns.isBirthday.requirement?.({ user: this })
}

userSchema.methods.toJSON = function (this: UserDocument) {
  const obj = this.toObject()
  delete obj.password
  delete obj.authentication
  return obj
}

const autoPopulate = function (this: UserDocument, next) {
  this
    .populate("customerData.rewards.categories")
    .populate("customerData.rewards.products")
  next()
}

userSchema.pre(/findOne/, autoPopulate)
userSchema.pre(/find/, autoPopulate)

const User = model<UserDocument>('User', userSchema)
export default User
