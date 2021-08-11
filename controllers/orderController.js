const db = require('../models')
const Order = db.Order

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
  }
}

module.exports = orderController
