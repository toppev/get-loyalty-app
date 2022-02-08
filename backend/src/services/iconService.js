import sharp from "sharp"
import fileService from "./fileService"

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

export default {
  resizeToPNG
}
