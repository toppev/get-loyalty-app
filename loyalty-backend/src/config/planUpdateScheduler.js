const planService = require('../services/planService')
const logger = require("../util/logger")

if (process.env.NODE_ENV !== "test") {
  planService.updateUserPlan()
    .then(() => logger.info("User plan checked/updated for the first time during the session."))
    .catch(err => logger.error("Failed to check/update user plan", err))

  setInterval(() => {
    planService.updateUserPlan()
      .then(() => logger.info("User plan checked/updated"))
      .catch(err => logger.error("Failed to check/update user plan", err))
  }, 2 * 60 * 60 * 1000) // 2 hours

}

