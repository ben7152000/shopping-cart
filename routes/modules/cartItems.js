const router = require('express').Router()
const cartController = require('../../controllers/cartController')

const auth = require('../../middleware/auth')
const checkToken = require('../../middleware/checkToken')

router.post('/:id/add', (req, res, next) => {
  checkToken(req, res, next, cartController.addCartItem)
}, auth.authenticated, cartController.addCartItem)
router.post('/:id/sub', (req, res, next) => {
  checkToken(req, res, next, cartController.subCartItem)
}, auth.authenticated, cartController.subCartItem)
router.delete('/:id', (req, res, next) => {
  checkToken(req, res, next, cartController.deleteCartItem)
}, auth.authenticated, cartController.deleteCartItem)

module.exports = router
