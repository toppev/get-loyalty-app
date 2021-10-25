import sharp from "sharp"
import toIco from "to-ico"
import fileService from "../services/fileService"

/**
 *
 * @param input
 * @param sizes
 * @param outputDir
 * @param name
 */
async function resizeToPNG(input, sizes, outputDir, name) {
  const tasks = sizes
    .map(size => sharp(input).resize(size, size)
      .toBuffer()
      .then(it => fileService.upload(`${outputDir}/${name}-${size}.png`, it)))
  return Promise.all(tasks)
}

/**
 * Generate a favicon.ico file from the PNG image source (URI). Saves it in the output
 */
async function generateFavicon(buffer, output) {
  const result = await toIco([buffer], {
    sizes: [16, 24, 32, 48, 64],
    resize: true
  })
  await fileService.upload(output, result)
}

export default {
  generateFavicon,
  resizeToPNG
}
