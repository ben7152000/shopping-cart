const router = require('express').Router()
const productController = require('../../controllers/productController')

router.get('/', productController.getProducts)

module.exports = router
