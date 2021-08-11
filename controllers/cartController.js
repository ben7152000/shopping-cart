const db = require('../models')
const Cart = db.Cart
const CartItem = db.CartItem

const cartController = {
  // 取所有產品
  getCart: async (req, res) => {
    try {
      let cart = await Cart.findByPk(req.session.cartId, { include: 'items' })
      cart = cart || { items: [] }
      const totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
      return res.render('cart', { cart, totalPrice })
    } catch (e) {
      console.log(e)
    }
  },
  // 加入購物車
  postCart: async (req, res) => {
    try {
      const [cart] = await Cart.findOrCreate({
        where:
            { id: req.session.cartId || 0 }
      })
      const [product, created] = await CartItem.findOrCreate({
        where: {
          CartId: cart.id,
          ProductId: req.body.productId
        },
        defaults: {
          quantity: 1
        }
      })
      if (!created) { product.quantity += 1 }
      await product.save()
      req.session.cartId = cart.id
      return res.redirect('back')
    } catch (e) {
      console.log(e)
    }
  },
  // 增加商品數量
  addCartItem: async (req, res) => {
    try {
      const cartItem = await CartItem.findByPk(req.params.id)
      cartItem.update({
        quantity: cartItem.quantity + 1
      })
      return res.redirect('back')
    } catch (e) {
      console.log(e)
    }
  },
  // 減少商品數量
  subCartItem: async (req, res) => {
    try {
      const cartItem = await CartItem.findByPk(req.params.id)
      cartItem.update({
        quantity: cartItem.quantity - 1 >= 1 ? cartItem.quantity - 1 : 1
      })
      return res.redirect('back')
    } catch (e) {
      console.log(e)
    }
  },
  // 刪除商品
  deleteCartItem: async (req, res) => {
    try {
      const cartItem = await CartItem.findByPk(req.params.id)
      cartItem.destroy()
      return res.redirect('back')
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = cartController
