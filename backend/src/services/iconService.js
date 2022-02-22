import sharp from "sharp"
import fileService from "./fileService"
import logger from "../util/logger"

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
      .then(data => {
        const suffix = keepName ? "" : `-${size}.png`
        const uploadName = `${outputDir}/${name}${suffix}`
        logger.info(`Resizing ${name} to ${uploadName} (${JSON.stringify(size)})`)
        return fileService.upload(uploadName, data, { contentType: "image/png", visibility: 'public' })
      }))
  return Promise.all(tasks)
}

export default {
  resizeToPNG
}
