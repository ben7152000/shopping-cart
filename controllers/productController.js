const db = require('../models')
const Product = db.Product
const Cart = db.Cart
const CartItem = db.CartItem

const productController = {
  // 所有產品
  // get
  getProducts: async (req, res, next) => {
    try {
      // 一面商品上限
      const PAGE_LIMIT = 9
      let PAGE_OFFSET = 0
      if (req.query.page) {
        PAGE_OFFSET = (req.query.page - 1) * PAGE_LIMIT
      }

      // 取商品
      const products = await Product.findAndCountAll({
        offset: PAGE_OFFSET,
        limit: PAGE_LIMIT
      })

      // 分頁
      const page = Number(req.query.page) || 1
      const pages = Math.ceil(products.count / PAGE_LIMIT)
      const totalPage = Array.from({ length: pages })
        .map((_, i) => i + 1)
      const prev = page - 1 ? page - 1 : 1
      const next = page + 1 > pages ? pages : page + 1

      // 購物車顯示
      // 沒有登入
      if (!req.user) {
        // 沒有購物車
        if (!req.session.cartId) {
          return res.render('products', { products, page, totalPage, prev, next })
        } else {
          let cart = await Cart.findByPk(req.session.cartId, { include: 'items' })
          cart = cart || { items: [] }
          const totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
          return res.render('products', { products, cart, totalPrice, page, totalPage, prev, next })
        }
      } else {
        // 登入後
        let cart = await Cart.findOne({
          where: { UserId: req.user.id },
          include: 'items'
        })
        if (!req.session.cartId) {
          if (!cart) {
            return res.render('products', { products, page, totalPage, prev, next })
          } else {
            cart = cart.toJSON()
            const totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
            return res.render('products', { products, cart, totalPrice, page, totalPage, prev, next })
          }
        } else {
          if (!cart) {
            // 更新使用者購物車
            await Cart.update(
              { UserId: req.user.id },
              { where: { id: req.session.cartId } }
            )
            let userCart = await Cart.findOne({
              where: { UserId: req.user.id },
              include: 'items'
            })
            userCart = userCart.toJSON()
            const totalPrice = userCart.items.length > 0 ? userCart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
            return res.render('products', { products, cart: userCart, totalPrice, page, totalPage, prev, next })
          } else {
            // 更新購物車 id
            await CartItem.update(
              { CartId: cart.id },
              { where: { CartId: req.session.cartId } }
            )
            // 顯示所有產品
            const cartItems = await CartItem.findAll({
              raw: true,
              nest: true,
              where: { CartId: cart.id }
            })
            const map = new Map()
            for (const item of cartItems) {
              if (map.get(item.ProductId)) {
                const cartItem = await CartItem.findByPk(map.get(item.ProductId))
                Promise.all([
                  cartItem.update({ quantity: cartItem.quantity + 1 }),
                  await CartItem.destroy({ where: { id: item.id } })
                ])
              } else {
                map.set(item.ProductId, item.id)
              }
            }
            // 刪除購物車
            if (cart.id !== req.session.cartId) {
              await Cart.destroy(
                { where: { id: req.session.cartId } }
              )
            } else {
              req.session.cartId = cart.id
            }
            let userCart = await Cart.findByPk(cart.id, {
              include: 'items'
            })
            userCart = userCart.toJSON()
            const totalPrice = userCart.items.length > 0 ? userCart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
            return res.render('products', { products, cart: userCart, totalPrice, page, totalPage, prev, next })
          }
        }
      }
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = productController
