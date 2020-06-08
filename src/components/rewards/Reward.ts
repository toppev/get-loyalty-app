import Category from "../categories/Category"
import Product from "../products/Product"

export default class Reward {

    id: string
    name: string
    itemDiscount: string
    description: string
    customerPoints: number
    requirement: string
    expires: Date | undefined
    products: Product[]
    categories: Category[]


    constructor(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.itemDiscount = data.itemDiscount;
        this.description = data.description || '';
        this.customerPoints = data.customerPoints;
        this.requirement = data.requirement;
        this.expires = data.expires;
        this.products = data.products || [];
        this.categories = data.categories || [];
    }

    toRequestObject() {
        const all = {
            ...this,
            categories: this.categories.map(i => i._id),
            products: this.products.map(i => i.id)
        };
        const { id, ...result } = all;
        return result;
    }
}