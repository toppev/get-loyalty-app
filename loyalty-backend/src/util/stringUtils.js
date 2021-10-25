function format(text, args = []) {
  return text.replace(/{(\d+)}/g, (match, number) => args[number] ? args[number] : match)
}

export {
  format
}
