import React from "react";

export interface AppContextInterface {
    businessId: string,
    user: object,
    loggedIn: boolean,
}

export const defaultAppContext: AppContextInterface = {
    businessId: "",
    user: {},
    loggedIn: false,
}

export default React.createContext<AppContextInterface>(defaultAppContext);