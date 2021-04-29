module.exports = {
  asyncFilter
}

async function asyncFilter(arr, predicate) {
  const results = await Promise.all(arr.map(predicate))
  return arr.filter((_v, index) => results[index])
}
