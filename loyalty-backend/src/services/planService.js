const businessService = require('./businessService')
const request = require("request");

const USER_PLAN_API = "https://api.getloyalty.app/user/plan"
const SERVER_KEY = process.env.SERVER_KEY
if (!SERVER_KEY && process.env.NODE_ENV !== 'test') {
    console.log(`Invalid SERVER_KEY env var.`);
}

module.exports = {
    updateUserPlan // TODO use
};


async function updateUserPlan() {
    try {
        const owner = await businessService.getBusinessOwnerUser();
        if (!owner) throw new Error("no business owner");
        const { email } = owner;
        if (!email) {
            console.log(`Invalid user email: ${email}`)
            return;
        }
        const business = await businessService.getBusiness()
        const plan = await getUserPlan(email);
        if (plan && planHasChanged(business.plan, plan)) {
            business.plan = plan
            await businessService.update(business)
        }
    } catch (err) {
        console.log("Updating user plan failed", err)
    }
}

async function getUserPlan(email) {
    return new Promise((resolve, reject) => {
        request.get(`${USER_PLAN_API}/?key=${SERVER_KEY}`, { email: email }, (err, _res, body) => {
            if (err) {
                reject(err)
            } else {
                resolve(body)
            }
        });
    })
}

/**
 * Returns whether the plans are different (something has changed)
 */
function planHasChanged(oldPlan, newPlan) {
    const oldJson = JSON.stringify(oldPlan)
    const newJson = JSON.stringify(newPlan)
    if (oldJson !== newJson) {
        console.log("Plan updated from", oldJson, "to", newJson)
        return true;
    }
    return false;
}