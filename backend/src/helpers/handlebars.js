import handlebars from "handlebars"
import helpers from "handlebars-helpers"

handlebars.registerHelper(helpers())

export default handlebars

export {
  validateHandlebars,
}


async function validateHandlebars(html) {
  try {
    const template = handlebars.compile(html)
    template({})
  } catch (err) {
    return { error: err }
  }
  return true
}

