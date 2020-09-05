export = index

declare const index: {
    [key: string]: CampaignType
    // To access typed individual properties
    isPurchaseGreaterThan: CampaignType
    isBirthday: CampaignType
    stamps: CampaignType
    customQuestion: CampaignType
}

declare interface CampaignType {
    name: string
    description: string
    experimental?: boolean
    note?: string
    question?: string
    valueDescriptions?: ValueDescription[]
    requirement?: (context: { values: string[], user: User, purchase: Purchase, customerData: CustomerData, campaign: Campaign }) => boolean
}

declare interface ValueDescription {
    name: string
    /** Type or the default value */
    type: "text" | "number" | string | number
}

declare interface User {
    id: string
    email: string | undefined
    hasPassword: boolean
    role: "user" | "business"
    lastVisit: Date
    birthday: Date | undefined
    authentication: {
        service: string
    }
    customerData: CustomerData
    createdAt: Date
}

declare interface CustomerData {
    purchases: Purchase[]
    rewards: Reward[]
    usedRewards: [{
        dateUsed: Date
        reward: Reward
    }]
    // For example, just to test if the user has enabled push notifications
    pushNotifications: {
        token: string
    }
    properties: {
        points: number
    }
}

declare interface Purchase {
    id: string
    createdAt: Date
}

declare interface Reward {
    id: string
    name: string
    description: string | undefined
    products: Product[]
    categories: Category[]
    // Linked campaign (i.e the campaign that rewarded the customer)
    campaign: Campaign
    itemDiscount: string
    customerPoints: number
    requirement: string | undefined
    expires: Date
    // ObjectID that identifies rewards even if the _id changes
    // i.e this field does not change when a user receives the Campaign#rewards
    recognition: string
}

declare interface Product {
    id: string
    name: string
    description: string | undefined
    categories: Category[]
    images: string[]
    price: string | undefined
}

declare interface Category {
    id: string
    name: string,
    parents: Category[]
    children: Category[]
    keywords: string[]
    official: boolean | undefined
    categoryType: undefined | null | "business" | "product" | "service"
}

declare interface Campaign {
    id: string
    start: Date
    end: Date | undefined
    createdAt: Date
    name: string
    description: string | undefined
    products: Product[]
    categories: Category[]
    requirements: any[]
    couponCode: string | undefined
    rewardedCount: number
    maxRewards: {
        total: number | undefined
        user: number
    }
    transactionPoints: number
    endReward: Reward[]
    totalStampsNeeded
}