import Product from "../products/Product";
import Category from "../categories/Category";
import Reward from "../rewards/Reward";
import allRequirements from "@toppev/getloyalty-campaigns";

class Campaign {

    id: string
    name: string
    description: string
    products: Product[]
    categories: Category[]
    requirements: Requirement[]
    rewardedCount?: number
    maxRewards: MaxRewards
    transactionPoints?: number
    endReward: Reward[]
    couponCode?: string
    start?: Date
    end?: Date

    constructor(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.products = data.products || [];
        this.categories = data.categories || [];
        this.requirements = data.requirements || [];
        this.rewardedCount = data.rewardedCount;
        this.maxRewards = data.maxRewards || { user: 1 };
        this.transactionPoints = data.transactionPoints;
        this.endReward = data.endReward || [];
        this.couponCode = data.couponCode;
        this.start = data.start && new Date(data.start);
        this.end = data.end && new Date(data.end);
    }

    toRequestObject() {
        const res = {
            ...this,
            categories: this.categories.map(i => i.id),
            products: this.products.map(i => i.id),
            requirements: this.requirements.map(req => {
                if (!req.question) {
                    delete req.question
                }
                return req;
            })
        };
        delete res.id;
        return res;
    }
}

type MaxRewards = { total: number, user: number }

/**
 * The saved requirement
 */
class Requirement {

    constructor(
        /**
         * The name of the key (e.g isBirthday)
         */
        public type: string,
        public values: string[] = [],
        public question?: string
    ) {
    }
}

/** Util to get the human readable name of the requirement as it's not stored in campaigns etc */
function getRequirementName(requirement: Requirement) {
    return allRequirements[requirement.type].name;
}


export {
    Campaign,
    Requirement,
    getRequirementName
}
