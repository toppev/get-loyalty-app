const FileUpload = require('../models/fileUpload')
const mime = require('mime-types')
const StatusError = require("../util/statusError")
const logger = require("../util/logger")

async function getUpload(name, { visibility } = {}) {
  const uploadsCountLimit = 100
  if (await FileUpload.countDocuments({}) > uploadsCountLimit) {
    const err = "Max uploads reached. Contact support."
    logger.severe(err, { uploadsCountLimit })
    throw new StatusError(401, err)
  }
  const res = await FileUpload.findById(name)
  if (res.visibility === (visibility || 'public')) {
    return res
  }
}

async function upload(name, data, { visibility, contentType } = {}) {
  return FileUpload.findOneAndUpdate({ _id: name }, {
    _id: name,
    data: data,
    contentType: contentType || mime.lookup(name),
    visibility: visibility || 'public'
  }, { upsert: true })
}

module.exports = {
  getUpload,
  upload,
}
