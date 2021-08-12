const orders = require('./modules/orders')
const carts = require('./modules/carts')
const cartItems = require('./modules/cartItems')
const products = require('./modules/products')
const users = require('./modules/users')
const admin = require('./modules/admin')

const auth = require('../middleware/auth')

module.exports = (app, passport) => {
  app.use('/order', auth.authenticated, orders)
  app.use('/cart', carts)
  app.use('/cartItem', cartItems)
  app.use('/products', products)
  app.use('/users', users)
  app.use('/admin', admin)
  app.use('/', (req, res) => res.redirect('/products'))
}
