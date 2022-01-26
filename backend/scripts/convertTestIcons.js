/**
 * Creates testresources/converted-favicon.ico and testresources/converted-icon-512x512.png from testresources/icon-192x192.png
 *
 * Check the new icons manually!
 */

const sharp = require("sharp")
const toIco = require("to-ico")
const fs = require("fs")

async function resizeToPNG(input, sizes, outputDir, name) {
  const tasks = sizes.map(size => sharp(input).resize(size, size).toFile(`${outputDir}/${name}-${size}.png`))
  return Promise.all(tasks)
}

async function generateFavicon(source, output) {
  const image = await fs.promises.readFile(source);

  const result = await toIco([image], {
    sizes: [16, 24, 32, 48, 64],
    resize: true
  })
  await fs.promises.writeFile(output, result)
}


const favicon = 'testresources/converted-favicon.ico'

console.log(`Generating ${favicon}`)
generateFavicon('./testresources/icon-192x192.png', favicon).then(() => {
  console.log(`${favicon} generated`)
})


const file512 = 'converted-icon'

console.log(`Generating ${file512}`)
resizeToPNG('./testresources/icon-192x192.png', [512], 'testresources', file512).then(() => {
  console.log(`${file512} generated`)
})
