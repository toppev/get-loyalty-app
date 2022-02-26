function format(text, args = []) {
  return text.replace(/{(\d+)}/g, (match, number) => args[number] ? args[number] : match)
}

function toFancyTimeLeft(date) {
  const ms = new Date(date).getTime() - Date.now()
  const totalMins = ms / 1000 / 60
  const hours = Math.floor(totalMins / 60)
  const mins = totalMins % 60
  return `${hours}h ${Math.ceil(mins)}m`
}

export {
  format,
  toFancyTimeLeft
}
