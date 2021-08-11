const router = require('express').Router()
const cartController = require('../../controllers/cartController')

const auth = require('../../middleware/auth')
const checkToken = require('../../middleware/checkToken')

router.get('/', (req, res, next) => {
  checkToken(req, res, next, cartController.getCart)
}, auth.authenticated, cartController.getCart)
router.post('/', (req, res, next) => {
  checkToken(req, res, next, cartController.postCart)
}, auth.authenticated, cartController.postCart)

module.exports = router
