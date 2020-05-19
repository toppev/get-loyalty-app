import Category from "../categories/Category"

export default class Product {

    constructor(
        public _id: string,
        public name: string,
        public description: string = "",
        public price: string = "",
        public categories: Category[] = []
    ) {
    }

    toRequestObject() {
        const res = { ...this, categories: this.categories.map(c => c._id) };
        return res;
    }
}