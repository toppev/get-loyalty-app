import React from "react";
import Product from "./Product";

export interface ProductContextInterface {
    products: Product[]
    addProducts: (products: Product[]) => void,
    deleteProduct: (product: Product) => void,
    updateProduct: (product: Product) => void
}

export const defaultProductContext: ProductContextInterface = {
    products: [{ _id: '163',categories: ['Pizzas'], name: 'Pizza', price: '10€', description: "A nice pineaple pizza" }],
    addProducts: () => {},
    deleteProduct: () => {},
    updateProduct: () => {}
}

export default React.createContext<ProductContextInterface>(defaultProductContext);