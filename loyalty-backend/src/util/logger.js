const dateStr = () => {
  const date = new Date()
  return date.getUTCFullYear() + "/" +
    ("0" + (date.getUTCMonth() + 1)).slice(-2) + "/" +
    ("0" + date.getUTCDate()).slice(-2) + " " +
    ("0" + date.getUTCHours()).slice(-2) + ":" +
    ("0" + date.getUTCMinutes()).slice(-2) + ":" +
    ("0" + date.getUTCSeconds()).slice(-2)
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

}

module.exports = logger
