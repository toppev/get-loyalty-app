import Category from "../categories/Category"

export default class Product {
    _id!: string
    name!: string
    description!: string
    price!: string
    categories: Category[] = []
}