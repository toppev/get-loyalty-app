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
async function resizeToPNG(input, sizes, outputDir, name, options = {}) {
  const { keepName } = options
  const tasks = sizes
    .map(size => sharp(input).resize(size.width || size, size.height || size)
      .toBuffer()
      .then(data => {
        const suffix = keepName ? "" : `-${size}.png`
        const uploadName = `${outputDir}/${name}${suffix}`
        logger.info(`Resizing ${name} to ${uploadName} (${JSON.stringify(size)})`)
        return fileService.upload(uploadName, data, { contentType: "image/png", visibility: 'public' })
      }))
  try {
    await Promise.all(tasks)
    logger.info("All resizes done")
  } catch (err) {
    logger.error("Failed to resize (some) images", err)
  }
}

export default {
  resizeToPNG
}
