function format(text, args = []) {
  return text.replace(/{(\d+)}/g, (match, number) => args[number] ? args[number] : match)
}

function toFancyTimeLeft(date) {
  const ms = new Date(date).getTime() - Date.now()
  const minutes = ms / 1000 / 60
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  if (hours >= 24) {
    return `${days}d ${Math.ceil(hours % 24)}h`
  }
  return `${hours}h ${Math.ceil(minutes % 60)}m`
}

export {
  format,
  toFancyTimeLeft
}
