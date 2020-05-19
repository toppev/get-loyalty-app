import Reward from "../rewards/Reward";

export default class Customer {
    _id!: string;
    email: string = ""; // keep?
    birthday?: Date = undefined;
    lastVisit?: Date = undefined;
    hasPassword?: boolean = false;
    authentication?: CustomerAuthentication = undefined
    customerData!: CustomerData
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