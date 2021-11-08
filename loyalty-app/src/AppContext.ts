import { createContext } from "react"

export interface AppContextInterface {
  user?: any
  set: (data: any) => any
}

export const defaultAppContext = {
  user: undefined,
  set: (data: any) => {}
}

export const AppContext = createContext<AppContextInterface>(defaultAppContext)
