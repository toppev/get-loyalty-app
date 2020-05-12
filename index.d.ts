declare interface RequirementType {
    name: string
    description: string
    question?: string
    requirement: (values: string[], user: any, purchase: any, customerData: any) => boolean
}

declare const index: {
    basicCampaign: RequirementType
    isPurchaseGreaterThan: RequirementType
    isBirthday: RequirementType
}

export = index
