import handlebars from "handlebars"

export {
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
