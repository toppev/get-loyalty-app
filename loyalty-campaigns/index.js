// @ts-check
/**
 * All campaign types.
 *
 * Each type may have "requirement" function that returns whether the user can receive the rewards.
 * If humans are needed (to answer a question), the "question" property should be specified.
 *
 * @type {import("./index")}
 */
module.exports = {
    isPurchaseGreaterThan: {
        name: 'Purchase Price',
        description: 'If the total cost of the purchase is more than the set value.',
        // We don't know the price so ask a human
        // {0} is the value parameter
        question: "Is the price of the purchase more than {0}?",
        valueDescriptions: [{
            name: 'Purchase amount',
            type: "number"
        }]
    },
    isBirthday: {
        name: 'Customer Birthday',
        description: "If it's the customer's birthday.",
        requirement: function ({ user }) {
            const { birthday: bd } = user
            if (bd) {
                const now = new Date()
                return bd.getMonth() === now.getMonth() && bd.getDate() === now.getDate()
            }
            return false
        },
    },
    stamps: {
        name: 'Stamp card',
        description: "Scan the user's QR code every time they make a purchase. After X scans they earn the reward.",
        valueDescriptions: [{
            name: 'Stamps to earn the reward',
            type: 5,
        }],
        requirement: function ({ values, customerData, purchase, campaign }) {
            const maxStamps = parseInt(values[0], 10)
            if (!maxStamps || !purchase) {
                return false
            }
            const duringCampaign = (date) => date > campaign.start && (!campaign.end || date < campaign.end)
            const currentStamps = customerData.purchases.filter(it => duringCampaign(it.createdAt))
            return currentStamps.length + 1 === maxStamps
        }
    },
    referral: {
        name: 'Referral',
        description: 'Users can refer others to use the app. Either the referrer user, referred user or both can be rewarded.',
        valueDescriptions: [{
            name: 'rewarded',
            type: ["referrer", "referred", "both"]
        }]
    },
    customQuestion: {
        name: 'Custom Question',
        description: 'Add a Yes/No question the cashier will answer. ' +
            'If answered "yes" and all other selected requirements are met, the customer will be rewarded.',
        question: 'The custom yes-no question.'
    }

}
