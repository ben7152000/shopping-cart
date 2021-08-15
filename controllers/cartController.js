const db = require('../models')
const Cart = db.Cart
const CartItem = db.CartItem

const cartController = {
  // 取所有產品
  // get
  getCart: async (req, res) => {
    try {
      // 確認使用者
      const user = req.user
      if (!user) {
        // 請先登入才能進購物車
        req.flash('warning_msg', '請先登入~')
        return res.redirect('/users/sign-in')
      }
      const UserId = req.user.id
      let cart = await Cart.findOne({
        where: { UserId },
        include: 'items'
      })
      // 沒有購物車
      if (!cart) res.render('cart')
      cart = cart.toJSON()
      const totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
      return res.render('cart', { cart, totalPrice })
    } catch (e) {
      console.log(e)
    }
  },
  // 加入購物車
  // post
  postCart: async (req, res) => {
    try {
      // 判斷是否有使用者
      const user = req.user
      let cart = {}
      if (user) {
        const [userCart] = await Cart.findOrCreate({
          where: { UserId: req.user.id || 0 }
        })
        cart = userCart
      } else {
        const [userCart] = await Cart.findOrCreate({
          where: { id: req.session.cartId || 0 },
          defaults: { UserId: 0 }
        })
        cart = userCart
      }
      const [product, created] = await CartItem.findOrCreate({
        where: {
          CartId: cart.id,
          ProductId: req.body.productId
        },
        defaults: { quantity: 1 }
      })
      if (!created) product.quantity += 1
      await product.save()
      req.session.cartId = cart.id
      return res.redirect('back')
    } catch (e) {
      console.log(e)
    }
  },
  // 增加商品數量
  // post
  addCartItem: async (req, res) => {
    try {
      const id = req.params.id
      const cartItem = await CartItem.findByPk(id)
      await cartItem.update({
        quantity: cartItem.quantity + 1
      })
      return res.redirect('back')
    } catch (e) {
      console.log(e)
    }
  },
  // 減少商品數量
  // post
  subCartItem: async (req, res) => {
    try {
      const id = req.params.id
      const cartItem = await CartItem.findByPk(id)
      await cartItem.update({
        quantity: cartItem.quantity - 1 >= 1 ? cartItem.quantity - 1 : 1
      })
      return res.redirect('back')
    } catch (e) {
      console.log(e)
    }
  },
  // 刪除商品
  // delete
  deleteCartItem: async (req, res) => {
    try {
      const id = req.params.id
      const cartItem = await CartItem.findByPk(id)
      await cartItem.destroy()
      return res.redirect('back')
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = cartController
