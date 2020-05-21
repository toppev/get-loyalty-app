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
        }
    },
    rewards: {
        name: 'Customer/Campaign Rewards (multiple)',
        identifier: 'rewards',
        placeholders: {
            length: {
                name: 'Number of rewards',
                description: 'Number of customer rewards'
            },
        }
    },
    reward: {
        name: 'Customer/Campaign Reward',
        identifier: 'reward',
        placeholders: {
            // TODO: available functions
            name: {
                name: 'Reward name',
                description: 'Name of the reward'
            },
            description: {
                name: 'Reward description',
                description: 'The description of the reward'
            },
            // TODO products
            categories: {
                name: 'Reward categories',
                description: 'List of reward categories'
            },
            campaign: {
                name: 'Reward campaign',
                description: 'The name of the campaign associated with this reward'
            },
            itemDiscount: {
                name: 'Discount',
                description: 'The discount of an item. e.g -50%, Free or "For $5 only!"'
            },
            note: {
                name: 'Reward note/requirement',
                description: 'A note or a requirement for this reward. e.g "not during xx-xx hours" or "only with meals"'
            },
            expires: {
                name: 'Reward expiration',
                description: 'The date when the reward expires'
            }
        }
    },
}

export { placeholders }
export type { Placeholder }

