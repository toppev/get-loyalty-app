import React from "react"
import Category from "../components/categories/Category"
import Reward from "../components/rewards/Reward"

export interface AppContextInterface {
  business: Business
  user: User
  loggedIn: boolean
  setBusiness: (business: Business) => any
  setUser: (user: User) => any
}

export interface User {
  _id: any
  email: string
  hasPassword: boolean
  role: string
}

export interface Business {
  plan: any
  _id: string
  categories: string[]
  email: string
  config: BusinessConfig
  public: BusinessPublic
}

export interface BusinessConfig {
  translations: {
    [key: string]: Translation
  },
  userRegistration: {
    dialogEnabled: boolean
  }
}

export interface Translation {
  singular: string
  plural: string
  placeholder?: string
}


export interface BusinessPublic {
  name: string
  description: string
  address: string
  website: string
  categories: Category[]
  customerLevels: CustomerLevel[]
}

export interface CustomerLevel {
  _id?: any
  name: string
  rewards: Reward[]
  requiredPoints?: number
  color?: string
  pointsFee: {
    // Every x millis
    period: number
    // y points will be withdrawn
    points: number
  }
}

export const defaultAppContext: AppContextInterface = {
  setBusiness: () => {
  },
  setUser: () => {
  },
  business: {
    _id: "123132",
    plan: { name: 'none', type: 'none', limits: {} },
    categories: [],
    config: {
      userRegistration: {
        dialogEnabled: false,
      },
      translations: {
        points: {
          plural: "POINTS!!!",
          singular: "POINT"
        }
      },
    },
    email: "asd@adw.dawd",
    public: {
      address: "Somestreet 123, Finland",
      categories: [],
      customerLevels: [],
      description: "a nice business",
      name: "BusinessWithName",
      website: "https://localhost:3000/somebusiness"
    }
  },
  user: {
    email: '',
    hasPassword: false,
    _id: 'id_unknown',
    role: 'user'
  },
  loggedIn: false,
}

export default React.createContext<AppContextInterface>(defaultAppContext)
