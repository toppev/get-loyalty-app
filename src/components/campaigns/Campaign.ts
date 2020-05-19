import Product from "../products/Product";
import Category from "../categories/Category";
import Reward from "../rewards/Reward";

class Campaign {

    constructor(
        public _id: string,
        public name: string,
        public description: string,
        public products: Product[] = [],
        public categories: Category[] = [],
        public requirements: Requirement[] = [],
        public rewardedCount?: number,
        public maxRewards: MaxRewards = {},
        public transactionPoints?: number,
        public endReward: Reward[] = [],
        public couponCode?: string,
        public start?: Date,
        public end?: Date,
    ) {
    }

    toRequestObject() {
        const res = {
            ...this,
            categories: this.categories.map(i => i._id),
            products: this.products.map(i => i._id)
        };
        return res;
    }
}

type MaxRewards = { total?: number, user?: number }

/**
 * The saved requirement
 */
class Requirement {

    constructor(
        public name: string,
        /**
         * The name of the key (e.g isBirthday)
         */
        public type: string,
        public values: string[] = [],
        public question?: string
    ) {
    }
}

export {
    Campaign,
    Requirement
}