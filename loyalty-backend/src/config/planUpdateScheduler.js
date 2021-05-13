const planService = require('../services/planService')

if (process.env.NODE_ENV !== "test") {
  planService.updateUserPlan()
    .then(() => console.log("User plan checked/updated for the first time during the session."))
    .catch(err => console.log("Failed to check/update user plan", err))

  setInterval(() => {
    planService.updateUserPlan()
      .then(() => console.log("User plan checked/updated"))
      .catch(err => console.log("Failed to check/update user plan", err))
  }, 2 * 60 * 60 * 1000) // 2 hours

}

