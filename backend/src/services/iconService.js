import sharp from "sharp"
import fileService from "./fileService"

/**
 *
 * @param input
 * @param sizes
 * @param outputDir
 * @param name
 */
async function resizeToPNG(input, sizes, outputDir, name, { keepName }) {
  const tasks = sizes
    .map(size => sharp(input).resize(size.width || size, size.height || size)
      .toBuffer()
      .then(it => {
        const suffix = keepName ? ".png" : `-${size}.png`
        return fileService.upload(`${outputDir}/${name}${suffix}`, it)
      }))
  return Promise.all(tasks)
}

export default {
  resizeToPNG
}
