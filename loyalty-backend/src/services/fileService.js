const FileUpload = require('../models/fileUpload')
const mime = require('mime-types')

async function getUpload(name, { visibility } = {}) {
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
