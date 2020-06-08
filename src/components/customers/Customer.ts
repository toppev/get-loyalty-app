import Reward from "../rewards/Reward";

export default class Customer {
    id!: string;
    email: string
    birthday?: Date
    lastVisit?: Date
    hasPassword?: boolean
    authentication?: CustomerAuthentication
    customerData!: CustomerData

    constructor(data: any) {
        this.id = data.id;
        this.email = data.email;
        this.birthday = data.birthday ? new Date(data.birthday) : undefined;
        this.lastVisit = data.lastVisit ? new Date(data.lastVisit) : undefined;
        this.hasPassword = data.hasPassword;
        this.authentication = data.authentication;
        this.customerData = data.customerData;
    }
}

interface CustomerAuthentication {
    service: string
}

interface CustomerData {
    role: string
    rewards: Reward[]
    properties: CustomerProperties
}

interface CustomerProperties {
    points: number
}