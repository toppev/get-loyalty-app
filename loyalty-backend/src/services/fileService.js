const FileUpload = require('../models/fileUpload')
const mime = require('mime-types')

async function getUpload(name) {
  return FileUpload.findById(name)
}

async function upload(name, data) {
  return FileUpload.findOneAndUpdate({ _id: name }, {
    _id: name,
    data: data,
    contentType: mime.lookup(name)
  }, { upsert: true })
}

module.exports = {
  getUpload,
  upload,
}
