// IDEA: maybe later use AWS s3 or the database for images too or something else

const fs = require('fs')
const separator = '/'

const uploadDir = process.env.UPLOAD_DIR || process.env.PWD.concat(`${separator}uploads`)
console.log(`Upload dir: ${uploadDir}`)

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir)
}

/**
 * Returns the file path of the file.
 * e.g /uploads/${fileName}
 */
function toPath(fileName) {
  return uploadDir + separator + fileName
}

async function upload(dirName, fileName, data) {
  const path = toPath(dirName + separator + fileName)
  const dir = dirName ? toPath(dirName) : uploadDir

  try {
    await fs.promises.access(dir)
  } catch (err) {
    await fs.promises.mkdir(dir, { recursive: true })
  }

  await writeFile(path, data)
  return path
}

/* Wrappers - So it's easy to replace with a S3 or whatever */

async function readFile(source, opts) {
  return fs.promises.readFile(source, opts)
}

async function writeFile(path, data) {
  await fs.promises.writeFile(path, data)
}

module.exports = {
  uploadDir,
  upload,
  toPath,
  readFile,
  writeFile
}
