import { createContext } from "react";

export interface AppContextInterface {
    user?: any
}

export const defaultAppContext = {
    user: undefined
};

export const AppContext = createContext<AppContextInterface>(defaultAppContext);