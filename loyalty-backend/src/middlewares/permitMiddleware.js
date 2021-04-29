module.exports = function permit(operation, params) {
  return (req, res, next) => {
    if (!req.user) {
      res.status(403).json({ message: "Forbidden: login required" })
    } else {
      req.user.hasPermission(operation, {
        userId: req.user.id,
        reqParams: req.params,
        ...params
      }).then(allowed => {
        if (allowed) {
          next()
        } else {
          res.status(403).json({ message: "Forbidden: no permission" })
        }
      }).catch(err => next(err))
    }
  }
}
