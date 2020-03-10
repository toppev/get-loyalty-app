import React from "react";

export interface AppContextInterface {
    business: Business,
    user: object,
    loggedIn: boolean,
}

export interface Business {
    _id: string,

}

export const defaultAppContext: AppContextInterface = {
    business: {
        _id: ""
    },
    user: {},
    loggedIn: false,
}

export default React.createContext<AppContextInterface>(defaultAppContext);