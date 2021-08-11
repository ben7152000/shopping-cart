const express = require('express')
const router = express.Router()

const productController = require('../controllers/productController.js')
const cartController = require('../controllers/cartController.js')

router.get('/products', productController.getProducts)

router.get('/cart', cartController.getCart)

module.exports = router
