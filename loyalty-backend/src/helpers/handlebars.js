const handlebars = require("handlebars")

module.exports = {
  validateHandlebars
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
