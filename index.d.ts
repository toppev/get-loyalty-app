declare interface RequirementType {
    name: string
    description: string
    experimental?: boolean
    note?: string
    question?: string
    valueDescriptions?: ValueDescription[]
    requirement?: (values: string[], user: any, purchase: any, customerData: any) => boolean
}

declare interface ValueDescription {
    name: string
    /**
     * Type or the default value
     */
    type: "text" | "number" | string | number
}

declare const index: {
    [key: string]: RequirementType
    // To access typed individual properties
    basicCampaign: RequirementType
    isPurchaseGreaterThan: RequirementType
    isBirthday: RequirementType
}

export = index
