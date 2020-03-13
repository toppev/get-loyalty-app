import React from "react";

export interface AppContextInterface {
    business: Business,
    user: User,
    loggedIn: boolean,
}

export interface User {
    email: string,

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
        email: 'test@example.com'
    },
    loggedIn: false,
}

export default React.createContext<AppContextInterface>(defaultAppContext);