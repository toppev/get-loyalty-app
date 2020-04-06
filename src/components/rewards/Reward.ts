import Category from "../categories/Category"
import Product from "../products/Product"

export default class Reward {

    constructor(
        public _id: string,
        public name: string,
        public description: string,
        public itemDiscount: string,
        public products: Product[] = [],
        public categories: Category[] = [],
        public customerPoints: number = 0,
        public requirement: string = "",
        public expires: Date | undefined = undefined
    ) { }
}