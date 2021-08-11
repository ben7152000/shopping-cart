const router = require('express').Router()
const orders = require('./modules/orders')
const carts = require('./modules/carts')
const cartItems = require('./modules/cartItems')
const products = require('./modules/products')
const users = require('./modules/users')
const admin = require('./modules/admin')

router.use('/order', orders)
router.use('/cart', carts)
router.use('/cartItem', cartItems)
router.use('/product', products)
router.use('/users', users)
router.use('/admin', admin)
router.use('/', (req, res) => res.redirect('/product'))

module.exports = router
