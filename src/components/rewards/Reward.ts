import Category from "../categories/Category"
import Product from "../products/Product"

export default class Reward {

    constructor(
        public _id: string,
        public name: string,
        public itemDiscount: string,
        public description: string = "",
        public customerPoints: number = 0,
        public requirement: string = "",
        public expires: Date | undefined = undefined,
        public products: Product[] = [],
        public categories: Category[] = [],
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