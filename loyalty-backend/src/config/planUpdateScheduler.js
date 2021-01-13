const planService = require('../services/planService');


planService.updateUserPlan()
    .then(() => console.log("User plan checked/updated for the first time"))

setInterval(() => {
    planService.updateUserPlan()
        .then(() => console.log("User plan checked/updated"))
}, 2 * 60 * 60 * 1000) // 2 hours