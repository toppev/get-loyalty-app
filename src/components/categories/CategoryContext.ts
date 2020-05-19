import React from "react";
import Category from "./Category";

export interface CategoryContextInterface {
    categories: Category[]
    addCategory: (category: Category) => void,
}

export const defaultCategoryContext: CategoryContextInterface = {
    categories: [],
    addCategory: () => {
    },
}

export default React.createContext<CategoryContextInterface>(defaultCategoryContext);