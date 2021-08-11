const router = require('express').Router()
const orders = require('./modules/orders')
const carts = require('./modules/carts')
const cartItems = require('./modules/cartItems')
const products = require('./modules/products')

router.use('/order', orders)
router.use('/cart', carts)
router.use('/cartItem', cartItems)
router.use('/product', products)

module.exports = router
