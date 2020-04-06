import React from "react";

export interface AppContextInterface {
    business: Business,
    user: User,
    loggedIn: boolean,
}

export interface User {
    _id: any
    email: string
    hasPassword: boolean
}

export interface Business {
    _id: string,
    categories: string[]
}

export const defaultAppContext: AppContextInterface = {
    business: {
        _id: "",
        categories: []
    },
    user: {
        email: 'test@example.com',
        hasPassword: false,
        _id: 'testid1234'
    },
    loggedIn: false,
}

export default React.createContext<AppContextInterface>(defaultAppContext);