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
      orders.forEach(order => { order.items = [] })
      ordersHavingProducts.forEach(product => {
        const index = orders.findIndex(order => order.id === product.id)
        if (index === -1) return
        orders[index].items.push(product.items)
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
      const id = req.params.id
      const order = await Order.findByPk(id, { include: 'items' })
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
  // 訂購清單
  // get
  fillOrderData: async (req, res) => {
    try {
      const UserId = req.user.id
      const cart = await Cart.findOne({ where: { UserId }, include: 'items' })
      if (!cart || !cart.items.length) {
        req.flash('warning_msg', '購物車空空的唷!')
        return res.redirect('/cart')
      }

      const cartId = cart.id
      const amount = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
      return res.render('orderInfo', { cartId, amount })
    } catch (e) {
      console.log(e)
    }
  },
  // 建立訂單
  // post
  // name, address, phone, amount, shipping_status, payment_status
  postOrder: async (req, res) => {
    try {
      const { cartId } = req.body
      const cart = await Cart.findByPk(cartId, { include: 'items' })
      // 建立訂單
      let order = await Order.create({
        ...req.body,
        UserId: req.user.id
      })
      order = order.toJSON()
      const items = Array.from({ length: cart.items.length })
        .map((_, i) => (
          OrderItem.create({
            OrderId: order.id,
            ProductId: cart.items[i].dataValues.id,
            price: cart.items[i].dataValues.price,
            quantity: cart.items[i].CartItem.dataValues.quantity
          })
        ))

      await Promise.all(items)

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
  // 取消訂單
  // post
  cancelOrder: async (req, res) => {
    try {
      const id = req.params.id
      const order = await Order.findByPk(id)
      await order.update({
        ...req.body,
        shipping_status: '-1',
        payment_status: '-1'
      })
      console.log('1111111111')
      req.flash('success_msg', '訂單已取消')
      return res.redirect('back')
    } catch (e) {
      console.log(e)
    }
  },
  // 交易後回傳
  // post
  newebpayCallback: async (req, res) => {
    try {
      const data = JSON.parse(mpgData.decryptData(req.body.TradeInfo))
      // 訂單
      const order = await Order.findOne({ where: { sn: data.Result.MerchantOrderNo } })
      console.log('11111111111')
      console.log('===================', order.id, data.Result.PaymentMethod, data.Message, data.Result.PayTime)

      if (data.Status === 'SUCCESS') {
        // 建立 payment
        await Payment.create({
          OrderId: order.id,
          payment_method: data.Result.PaymentMethod ? data.Result.PaymentMethod : data.Result.PaymentType,
          isSuccess: true,
          failure_message: data.Message,
          payTime: data.Result.PayTime
        })
        await order.update({
          ...req.body,
          payment_status: '1'
        })
        // 發送 mail
        const email = req.user.email
        const subject = `[TEST]Diving Park 訂單編號:${order.id} 付款成功!`
        const status = '未出貨 / 已付款'
        const msg = '近期內會安排出貨 再麻煩注意電子郵件!'
        nodeMailer.sendMail(email, subject, nodeMailer.sendPayMail(order, status, msg))
        req.flash('success_msg', `訂單編號:${order.id} 付款成功!`)
      } else {
        req.flash('warning_msg', `訂單編號:${order.id} 付款失敗!  [說明] ${data.Message}`)
      }
      return res.redirect(`/order/${order.id}`)
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = orderController
