import FileUpload, { IFileUpload } from "../models/fileUpload"
import mime from "mime-types"
import StatusError from "../util/statusError"
import logger from "../util/logger"
import { Response } from 'express'

const defaultOptions = {
  visibility: 'public'
}

async function getUpload(name, { visibility } = defaultOptions) {
  const res = await FileUpload.findById(name)
  logger.info(`Upload ${name} found: ${!!res}`)
  if (res?.visibility === (visibility || 'public')) {
    return res
  }
}

async function upload(name, data, options = { ...defaultOptions, contentType: mime.lookup(name) || '' }) {
  logger.info(`Uploading a new file ${name}`)
  const uploadsCountLimit = 100
  if (await FileUpload.countDocuments({}) > uploadsCountLimit) {
    const err = "Max uploads reached. Contact support."
    logger.severe(err, { uploadsCountLimit })
    throw new StatusError(401, err)
  }
  return FileUpload.findOneAndUpdate({ _id: name }, {
    _id: name,
    data: data,
    contentType: options.contentType || mime.lookup(name) || undefined,
    visibility: options.visibility === 'private' ? 'private' : 'public'
  }, { upsert: true })
}

async function getUploads(dir, { visibility } = defaultOptions) {
  return FileUpload.find({
    _id: new RegExp(`^${dir}/`),
    visibility: visibility === 'private' ? 'private' : 'public'
  })
}

function serveFile(res: Response, file: IFileUpload | undefined) {
  if (file?.data) {
    // @ts-ignore
    res.contentType(file.contentType)
    res.send(file.data)
  } else if (file?.externalSource) {
    res.redirect(file.externalSource)
  } else {
    logger.warning(`File ${file} could not be served: no data to serve`)
    res.sendStatus(404)
  }
}

export default {
  upload,
  getUpload,
  getUploads,
  serveFile
}
