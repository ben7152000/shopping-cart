const db = require('../models')
const Product = db.Product
const Cart = db.Cart

const productController = {
  // 取所有產品
  getProducts: async (req, res) => {
    try {
      const products = await Product.findAndCountAll({ offset: 0, limit: 3 })
      let cart = await Cart.findByPk(req.session.cartId, {
        include: 'items'
      })
      cart = cart || { items: [] }
      const totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
      return res.render('products', { products, cart, totalPrice })
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = productController
