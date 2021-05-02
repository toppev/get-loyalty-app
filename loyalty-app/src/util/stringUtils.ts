const getTextBetween = (text: string, str1: string, str2: string) => {
  return text.substring(
    text.indexOf(str1) + str1.length,
    text.indexOf(str2)
  )
}

// TODO: implement
const getAllTextBetween = (text: string, str1: string, str2: string) => getTextBetween(text, str1, str2)

export {
  getTextBetween,
  getAllTextBetween
}
