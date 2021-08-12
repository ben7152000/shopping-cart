const db = require('../models')
const Order = db.Order
const OrderItem = db.OrderItem
const Cart = db.Cart
const Payment = db.Payment
const nodeMailer = require('../utils/nodemailer')
const mpgData = require('../utils/mpgData')

const orderController = {
  // 取得所有訂單
  // get
  getOrders: async (req, res) => {
    try {
      const ordersHavingProducts = await Order.findAll({
        raw: true,
        nest: true,
        where: { UserId: req.user.id },
        include: 'items'
      })
      const orders = await Order.findAll({
        raw: true,
        nest: true,
        where: { UserId: req.user.id }
      })
      orders.forEach(order => {
        order.orderProducts = []
      })
      ordersHavingProducts.forEach(product => {
        const index = orders.findIndex(order => order.id === product.id)
        if (index === -1) return
        orders[index].orderProducts.push(product.orderProducts)
      })
      return res.render('orders', { orders })
    } catch (e) {
      console.log(e)
    }
  },
  // 個別訂單
  // get
  getOrder: async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id, { include: 'items' })
      if (order.toJSON().payment_status === '0') {
        const tradeData = mpgData.getData(order.amount, 'Diving Park-精選商品', req.user.email)
        await order.update({ sn: tradeData.MerchantOrderNo.toString() })
        return res.render('order', { order: order.toJSON(), tradeData })
      } else {
        const paidOrder = true
        return res.render('order', { order: order.toJSON(), paidOrder })
      }
    } catch (e) {
      console.log(e)
    }
  },
  // 建立訂單
  // post
  // name, address, phone, amount, shipping_status, payment_status
  postOrder: async (req, res) => {
    try {
      const cart = await Cart.findByPk(req.body.cartId, { include: 'items' })
      // 建立訂單
      const order = await Order.create({
        UserId: req.user.id,
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

      // 發送 mail
      const email = req.user.email
      const subject = `[TEST]Diving Park 訂購編號:${order.id} 成立，請把握時間付款`
      const status = '未出貨 / 未付款'
      const msg = '請點擊付款連結並使用測試信用卡付款! 感謝配合!'

      nodeMailer.sendMail(email, subject, nodeMailer.orderMail(order, status, msg))

      // 清空購物車
      await cart.destroy()
      req.session.cartId = ''
      return res.redirect(`/order/${order.id}`)
    } catch (e) {
      console.log(e)
    }
  },
  // 刪除訂單
  // post
  cancelOrder: async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id)
      await order.update({
        ...req.body,
        shipping_status: '-1',
        payment_status: '-1'
      })
      return res.redirect('back')
    } catch (e) {
      console.log(e)
    }
  },
  // 取得付款頁面
  // get
  getPayment: async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id, { include: 'items' })
      const tradeInfo = mpgData.getData(order.amount, '產品名稱', req.user.email)
      order.update({
        ...req.body,
        sn: tradeInfo.MerchantOrderNo
      })
      return res.render('payment', { order, tradeInfo })
    } catch (e) {
      console.log(e)
    }
  },
  // 交易後回傳
  spgatewayCallback: async (req, res) => {
    try {
      const data = JSON.parse(mpgData.decryptData(req.body.TradeInfo))
      // 訂單
      const order = await Order.findAll({
        where: { sn: data.Result.MerchantOrderNo }
      })
      // 建立 payment
      await Payment.create({
        OrderId: order.id,
        payment_method: data.Result.PaymentMethod ? data.Result.PaymentMethod : data.Result.PaymentType,
        isSuccess: data.Status === 'SUCCESS',
        failure_message: data.Message,
        payTime: data.Result.PayTime
      })
      if (data.Status === 'SUCCESS') {
        await order[0].update({
          ...req.body,
          payment_status: 1
        })

        // 發送 mail
        const email = req.user.email
        const subject = `[TEST]Diving Park 訂單編號:${order.id} 付款成功!`
        const status = '未出貨 / 已付款'
        const msg = '近期內會安排出貨 再麻煩注意電子郵件!'
        nodeMailer.sendMail(email, subject, nodeMailer.sendPayMail(order, status, msg))
      }

      return res.redirect(`/orders/${order.id}`)
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = orderController
