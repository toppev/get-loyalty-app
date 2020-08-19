declare interface CampaignType {
    name: string
    description: string
    experimental?: boolean
    note?: string
    question?: string
    valueDescriptions?: ValueDescription[]
    requirement?: (context: { values: string[], user: any, purchase: any, customerData: any, campaign: any }) => boolean
}

declare interface ValueDescription {
    name: string
    /**
     * Type or the default value
     */
    type: "text" | "number" | string | number
}

declare const index: {
    [key: string]: CampaignType
    // To access typed individual properties
    isPurchaseGreaterThan: CampaignType
    isBirthday: CampaignType
    stamps: CampaignType
}

export = index
