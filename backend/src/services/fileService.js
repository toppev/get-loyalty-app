import FileUpload from "../models/fileUpload"
import mime from "mime-types"
import StatusError from "../util/statusError"
import logger from "../util/logger"

const defaultOptions = {
  visibility: 'public'
}

async function getUpload(name, { visibility } = defaultOptions) {
  const uploadsCountLimit = 100
  if (await FileUpload.countDocuments({}) > uploadsCountLimit) {
    const err = "Max uploads reached. Contact support."
    logger.severe(err, { uploadsCountLimit })
    throw new StatusError(401, err)
  }
  const res = await FileUpload.findById(name)
  if (res?.visibility === (visibility || 'public')) {
    return res
  }
}

async function upload(name, data, options = { ...defaultOptions, contentType: mime.lookup(name) || ''}) {
  return FileUpload.findOneAndUpdate({ _id: name }, {
    _id: name,
    data: data,
    contentType: options.contentType || mime.lookup(name),
    visibility: options.visibility || 'public'
  }, { upsert: true })
}

async function getUploads(dir, { visibility } = defaultOptions) {
  return FileUpload.find({
    _id: new RegExp(`^${dir}/`),
    visibility: visibility || 'public'
  })
}

export default {
  upload,
  getUpload,
  getUploads,
}
