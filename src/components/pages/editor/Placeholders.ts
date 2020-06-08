import { AppContextInterface } from "../../../context/AppContext";

type Context = { appContext: AppContextInterface }

interface Placeholder {
    name: string
    description: string
    // Whether the placeholder is (currently) available. Boolean or string explaining why
    available?: (context: Context) => boolean | string
}

interface PlaceholderCategory {
    name: string
    // The object name
    identifier: string
    placeholders: {
        // The object property
        [key: string]: Placeholder
    }
}

interface Placeholders {
    [key: string]: PlaceholderCategory
}

const placeholders: Placeholders = {
    // Some placeholders are grapesjs blocks (campaigns, their rewards, products, user rewards etc)
    // see pages/editor/blocks directory
    businessPlaceholders: {
        name: 'Business Placeholders',
        identifier: 'business',
        placeholders: {
            address: {
                name: 'Business address',
                description: "The address of your business"
            },
            name: {
                name: 'Business name',
                description: "Your business name"
            },
            description: {
                name: 'Business description',
                description: 'The description of your business'
            },
            website: {
                name: 'Business website',
                description: "Your business's website"
            }
        }
    },
    customerPlaceholders: {
        name: 'Customer Placeholders',
        identifier: 'customer',
        placeholders: {
            birthday: {
                name: 'Birthday',
                description: "The customer's birthday"
            },
            email: {
                name: 'Email',
                description: "The customer's email",
            },
            birthdayGreeting: {
                name: 'Birthday greetings',
                description: 'Display a birthday greeting message if today is the customers birthday'
            }
        }
    },
    customerRewards: {
        name: 'Customer Rewards',
        identifier: 'rewards',
        placeholders: {
            unused: {
                name: 'Number of rewards',
                description: 'Number of unused customer rewards'
            },
            used: {
                name: 'Number of used rewards',
                description: 'Number of rewards the customer has used'
            }
        }
    }
}

export { placeholders }
export type { Placeholder }

