function checkToken (req, res, next, controller) {
  if (req.session.token) {
    return next()
  } else {
    controller(req, res, next)
  }
}

module.exports = checkToken
