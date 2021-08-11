const db = require('../models')
const Order = db.Order
const OrderItem = db.OrderItem
const Cart = db.Cart

const orderController = {
  // 取得所有訂單
  getOrders: async (req, res) => {
    try {
      const orders = await Order.findAll({ include: 'items' })
      return res.render('orders', {
        orders
      })
    } catch (e) {
      console.log(e)
    }
  },
  // 建立訂單
  postOrder: async (req, res) => {
    try {
      const cart = await Cart.findByPk(req.body.cartId, { include: 'items' })
      const order = await Order.create({
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        shipping_status: req.body.shipping_status,
        payment_status: req.body.payment_status,
        amount: req.body.amount
      })
      const results = []
      for (let i = 0; i < cart.items.length; i++) {
        const orderItem = await OrderItem.create({
          OrderId: order.id,
          ProductId: cart.items[i].id,
          price: cart.items[i].price,
          quantity: cart.items[i].CartItem.quantity
        })
        results.push(orderItem)
      }
      return res.redirect('/orders')
    } catch (e) {
      console.log(e)
    }
  },
  // 刪除訂單
  cancelOrder: async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id)
      order.update({
        ...req.body,
        shipping_status: '-1',
        payment_status: '-1'
      })
      return res.redirect('back')
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = orderController
