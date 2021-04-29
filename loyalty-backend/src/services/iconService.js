const fs = require('fs')
const sharp = require('sharp')
const toIco = require('to-ico')
const uploader = require('../helpers/uploader')

/**
 *
 * @param input
 * @param sizes
 * @param outputDir
 * @param name
 */
async function resizeToPNG(input, sizes, outputDir, name) {
  const tasks = sizes.map(size => sharp(input).resize(size, size).toFile(`${outputDir}/${name}-${size}.png`))
  return Promise.all(tasks)
}

/**
 * Generate a favicon.ico file from the PNG image source (URI). Saves it in the output
 */
async function generateFavicon(source, output) {
  const image = await uploader.readFile(source)

  const result = await toIco([image], {
    sizes: [16, 24, 32, 48, 64],
    resize: true
  })
  await uploader.writeFile(output, result)
}

module.exports = {
  generateFavicon,
  resizeToPNG
}
