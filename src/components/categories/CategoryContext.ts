import React from "react";
import Category from "./Category";

export interface CategoryContextInterface {
    categories: Category[]
    addCategory: (category: Category) => void,
}

export const defaultProductContext: CategoryContextInterface = {
    categories: [],
    addCategory: () => { },
}

export default React.createContext<CategoryContextInterface>(defaultProductContext);