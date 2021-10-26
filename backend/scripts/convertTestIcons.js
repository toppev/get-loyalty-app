/**
 * Creates testresources/converted-favicon.ico and testresources/converted-icon-512x512.png from testresources/icon-192x192.png
 *
 * Check the new icons manually!
 */

const iconService = require('../src/services/iconService')


const favicon = 'testresources/converted-favicon.ico'
console.log(`Generating ${favicon}`)
iconService.generateFavicon('./testresources/icon-192x192.png', favicon).then(() => {
  console.log(`${favicon} generated`)
})


const file512 = 'converted-icon'
console.log(`Generating ${file512}`)
iconService.resizeToPNG('./testresources/icon-192x192.png', [512], 'testresources', file512).then(() => {
  console.log(`${file512} generated`)
})
