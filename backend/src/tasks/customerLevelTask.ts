import customerService from "../services/customerService"
import User from "../models/user"
import businessService from "../services/businessService"
import logger from "../util/logger"

export default function initLevelTask() {

  setTimeout(async () => {
    await checkLevels()
  }, 1000 * 60 * 5) // First in 5 minutes

  setInterval(async () => {
    await checkLevels()
  }, 1000 * 60 * 60) // otherwise hourly

}

async function checkLevels() {
  try {
    const st = Date.now()
    logger.info("Starting customer level check...")

    const business = await businessService.getBusiness()
    if (!business) {
      logger.info("skipping: no business found...")
    } else {
      const users = await User.find()
      const levels = business.public.customerLevels
      logger.info(`Checking ${users.length} customers, levels=${levels.length}`)

      if (levels.length) {
        for (const user of users) {
          await customerService.checkCustomerLevelExpires(user, business)
        }
      }

      logger.info(`Completed customer level check in ${Date.now() - st} ms.`)
    }
  } catch (err) {
    logger.severe("Customer level check failed", err)
  }
}
