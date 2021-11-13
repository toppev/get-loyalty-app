import customerService from "src/services/customerService"
import User from "src/models/user"
import businessService from "src/services/businessService"
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
  const st = Date.now()
  logger.info("Starting customer level check...")

  const business = await businessService.getBusiness()
  const users = await User.find()
  logger.info(`Checking ${users.length} customers`)

  for (const user of users) {
    await customerService.checkCustomerLevelExpires(user, business)
  }

  logger.info(`Completed customer level check in ${Date.now() - st} ms.`)
}
