const router = require('express').Router()
const productController = require('../../controllers/productController')

const auth = require('../../middleware/auth')
const checkToken = require('../../middleware/checkToken')

router.get('/', (req, res, next) => {
  checkToken(req, res, next, productController.getProducts)
}, auth.authenticated, productController.getProducts)

module.exports = router
