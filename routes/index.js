const express = require('express')
const router = express.Router()

const productController = require('../controllers/productController.js')
const cartController = require('../controllers/cartController.js')
const orderController = require('../controllers/orderController.js')

// 產品
router.get('/products', productController.getProducts)

// 購物車
router.get('/cart', cartController.getCart)
router.post('/cart', cartController.postCart)
router.post('/cartItem/:id/add', cartController.addCartItem)
router.post('/cartItem/:id/sub', cartController.subCartItem)
router.delete('/cartItem/:id', cartController.deleteCartItem)

// 訂單
router.get('/orders', orderController.getOrders)
router.post('/order', orderController.postOrder)
router.post('/order/:id/cancel', orderController.cancelOrder)
router.get('/order/:id/payment', orderController.getPayment)

// 第三方串接
router.post('/spgateway/callback', orderController.spgatewayCallback)

module.exports = router
