import React from "react";
import Category from "../components/categories/Category";
import Reward from "../components/rewards/Reward";

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
}

export interface Business {
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
    openingHours: OpeningHour[]
    categories: Category[]
    customerLevels: CustomerLevel[]
}

export interface CustomerLevel {
    _id?: any
    name: string
    rewards: Reward[]
    requiredPoints?: number
    color?: string
}

export interface OpeningHour {
    dayOfWeek: number
    hours: string
    validFrom: Date
    validThrough: Date
}


export const defaultAppContext: AppContextInterface = {
    setBusiness: () => {
    },
    setUser: () => {
    },
    business: {
        _id: "123132",
        categories: [],
        config: {
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
            openingHours: [],
            website: "https://localhost:3000/somebusiness"
        }
    },
    user: {
        email: 'test@example.com',
        hasPassword: false,
        _id: 'testid1234'
    },
    loggedIn: false,
}

export default React.createContext<AppContextInterface>(defaultAppContext);