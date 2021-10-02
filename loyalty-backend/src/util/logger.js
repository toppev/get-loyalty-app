const DEBUG_ENABLED = process.env.LOG_LEVEL?.toLowerCase() === "debug"

const dateStr = () => {
  const date = new Date()
  return date.getFullYear() + "/" +
    ("0" + (date.getMonth() + 1)).slice(-2) + "/" +
    ("0" + date.getDate()).slice(-2) + " " +
    ("0" + date.getHours()).slice(-2) + ":" +
    ("0" + date.getMinutes()).slice(-2) + ":" +
    ("0" + date.getSeconds()).slice(-2)
}


const logger = {

  info: function (...message) {
    console.log(dateStr(), "INFO", message.join(' '))
  },

  warning: function (...message) {
    console.log(dateStr(), "WARN", message.join(' '))
  },

  error: function (message, error) {
    console.log(dateStr(), "ERROR", message, error || '')
  },

  severe: function (message, error) {
    console.log(dateStr(), "SEVERE", message, error || '')
  },

  important: function (...message) {
    console.log(dateStr(), "IMPORTANT", message.join(' '))
  },

  debug(data) {
    DEBUG_ENABLED && console.log(dateStr(), "DEBUG", data)
  },

  dateStr,
}

module.exports = logger
