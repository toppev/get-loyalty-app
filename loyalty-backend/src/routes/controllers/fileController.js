const mongoose = require('mongoose')
const router = require('express').Router()
const Busboy = require('busboy')
const fileService = require('../../services/fileService')
const permit = require('../../middlewares/permitMiddleware')
const StatusError = require("../../util/statusError")

router.post('/upload', permit('file:upload'), uploadFile)
router.get('/:fileId', getFile)

module.exports = router

function getFile(req, res, next) {
  const fileId = req.params.fileId
  if (!fileId) throw new StatusError(400, "no fileId specified")
  fileService.getUpload(`uploads/${fileId}`, { visibility: 'public' })
    .then(file => {
      if (!file) res.sendStatus(404)
      else {
        res.contentType(file.contentType)
        res.send(file.data)
      }
    })
    .catch(err => next(err))
}

function uploadFile(req, res, next) {
  const fileSizeLimit = 5 * 1024 // KB
  const busboy = new Busboy({ headers: req.headers, limits: { fileSize: (1024 * fileSizeLimit) } })
  busboy.on('file', function (fieldName, file, filename, encoding, mimetype) {
    file.on('limit', function () {
      res.status(400).json({ message: `Max file size: ${fileSizeLimit}KB` })
    })
    file.on('data', function (data) {
      const fileId = new mongoose.mongo.ObjectId()
      fileService.upload(`uploads/${fileId}`, data, { contentType: mimetype })
        .then(() => res.json({ success: true, data: [fileId] }))
        .catch(err => next(err))
    })
  })
  return req.pipe(busboy)
}
