const crypto = require('crypto')
const db = require('../models')
const Order = db.Order
const OrderItem = db.OrderItem
const Cart = db.Cart
const nodeMailer = require('../utils/nodemailer')

const URL = process.env.NEWEBPAY_URL
const MerchantID = process.env.NEWEBPAY_MERCHANT_ID
const HashKey = process.env.NEWEBPAY_HASH_KEY
const HashIV = process.env.NEWEBPAY_HASH_IV
const PayGateWay = 'https://ccore.spgateway.com/MPG/mpg_gateway'
const ReturnURL = URL + '/spgateway/callback?from=ReturnURL'
const NotifyURL = URL + '/spgateway/callback?from=NotifyURL'
const ClientBackURL = URL + '/orders'

// 串接資訊
function genDataChain (TradeInfo) {
  const results = []
  for (const kv of Object.entries(TradeInfo)) {
    results.push(`${kv[0]}=${kv[1]}`)
  }
  return results.join('&')
}

// 加密資訊
function createMpgAesEncrypt (TradeInfo) {
  const encrypt = crypto.createCipheriv('aes256', HashKey, HashIV)
  const enc = encrypt.update(genDataChain(TradeInfo), 'utf8', 'hex')
  return enc + encrypt.final('hex')
}

function createMpgAesDecrypt (TradeInfo) {
  const decrypt = crypto.createDecipheriv('aes256', HashKey, HashIV)
  decrypt.setAutoPadding(false)
  const text = decrypt.update(TradeInfo, 'hex', 'utf8')
  const plainText = text + decrypt.final('utf8')
  const result = plainText.replace(/[\x00-\x20]+/g, '')
  return result
}

function createMpgShaEncrypt (TradeInfo) {
  const sha = crypto.createHash('sha256')
  const plainText = `HashKey=${HashKey}&${TradeInfo}&HashIV=${HashIV}`

  return sha.update(plainText).digest('hex').toUpperCase()
}

function getTradeInfo (Amt, Desc, email) {
  const data = {
    MerchantID: MerchantID, // 商店代號
    RespondType: 'JSON', // 回傳格式
    TimeStamp: Date.now(), // 時間戳記
    Version: 1.5, // 串接程式版本
    MerchantOrderNo: Date.now(), // 商店訂單編號
    LoginType: 0, // 智付通會員
    OrderComment: 'OrderComment', // 商店備註
    Amt: Amt, // 訂單金額
    ItemDesc: Desc, // 產品名稱
    Email: email, // 付款人電子信箱
    ReturnURL: ReturnURL, // 支付完成返回商店網址
    NotifyURL: NotifyURL, // 支付通知網址/每期授權結果通知
    ClientBackURL: ClientBackURL // 支付取消返回商店網址
  }

  const mpgAesEncrypt = createMpgAesEncrypt(data)
  const mpgShaEncrypt = createMpgShaEncrypt(mpgAesEncrypt)

  const tradeInfo = {
    MerchantID: MerchantID, // 商店代號
    TradeInfo: mpgAesEncrypt, // 加密後參數
    TradeSha: mpgShaEncrypt,
    Version: 1.5, // 串接程式版本
    PayGateWay: PayGateWay,
    MerchantOrderNo: data.MerchantOrderNo
  }
  return tradeInfo
}

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

      nodeMailer.sendMail('ben7152000@gmail.com', 'hi', 'hihi')

      return res.redirect('/order')
    } catch (e) {
      console.log(e)
    }
  },
  // 刪除訂單
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
  getPayment: async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id)
      const tradeInfo = getTradeInfo(order.amount, '產品名稱', 'ben7152000@gmail.com')
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
      const data = JSON.parse(createMpgAesDecrypt(req.body.TradeInfo))
      const order = await Order.findAll({
        where: { sn: data.Result.MerchantOrderNo }
      })
      await order[0].update({
        ...req.body,
        payment_status: 1
      })
      return res.redirect('/orders')
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = orderController
