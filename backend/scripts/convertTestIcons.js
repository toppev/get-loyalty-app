/**
 * Creates testresources/converted-icon-512x512.png from testresources/icon-192x192.png
 *
 * Check the new icons manually!
 */

const sharp = require("sharp")

async function resizeToPNG(input, sizes, outputDir, name) {
  const tasks = sizes.map(size => sharp(input).resize(size, size).toFile(`${outputDir}/${name}-${size}.png`))
  return Promise.all(tasks)
}

const file512 = 'converted-icon'

console.log(`Generating ${file512}`)
resizeToPNG('./testresources/icon-192x192.png', [512], 'testresources', file512).then(() => {
  console.log(`${file512} generated`)
})
