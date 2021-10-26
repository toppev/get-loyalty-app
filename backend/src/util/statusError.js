/** Error with a message and a status code */
import logger from "./logger"

export default class StatusError extends Error {

  constructor(message, status) {
    super(message)
    if (status < 100 || status >= 600) {
      logger.warning(`Invalid status code ${status}. Returning 500`)
      status = 500
    }
    this.status = status
    this.name = this.constructor.name
  }

}
