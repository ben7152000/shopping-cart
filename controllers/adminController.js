const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodeMailer = require('../utils/nodemailer')
const db = require('../models')
const User = db.User
const Product = db.Product
const Order = db.Order

const adminController = {
  // 管理者登入頁面
  // get
  signInPage: (req, res) => {
    const { email } = req.session
    return res.render('admin/signin', { email })
  },
  // 管理者登入
  // post
  // email, password
  signIn: async (req, res) => {
    try {
      const { email, password } = req.body

      // 尋找管理者
      const user = await User.findOne({ where: { email } })

      // email 錯誤
      if (!user) {
        return res.redirect('/admin/sign-in')
      }

      // 管理者
      if (user.role !== 'admin') {
        return res.redirect('/admin/sign-in')
      }

      // 解密
      const hashPassword = await bcrypt.compare(password, user.password)

      // 密碼錯誤
      if (!hashPassword) {
        return res.redirect('/users/sign-in')
      }

      // 發放 token
      const payload = { id: user.id }
      const expiresIn = { expiresIn: '24h' }
      const token = jwt.sign(payload, process.env.JWT_SECRET, expiresIn)

      // 存入 session
      req.session.email = email
      req.session.token = token

      return res.redirect('/admin/products')
    } catch (e) {
      console.log(e)
    }
  },
  // 管理者登出
  // get
  signOut: (req, res) => {
    req.logout()
    req.session.email = ''
    req.session.token = ''
    return res.redirect('/admin/sign-in')
  },
  // 所有產品頁面
  // get
  getProducts: async (req, res) => {
    try {
      const products = await Product.findAll({
        raw: true,
        nest: true
      })
      return res.render('admin/products', { products })
    } catch (e) {
      console.log(e)
    }
  },
  // 註冊商品
  // post
  // name, description, price
  postProducts: async (req, res) => {
    try {
      const { name, description, price } = req.body
      if (req.file) {
        await Product.create({
          name,
          description,
          price,
          image: req.file.path
        })
      } else {
        await Product.create({
          name,
          description,
          price
        })
      }
      return res.redirect('back')
    } catch (e) {
      console.log(e)
    }
  },
  // 商品詳細
  // get
  getProduct: async (req, res) => {
    try {
      const status = 1
      const product = await Product.findByPk(req.params.id)
      const products = await Product.findAll({
        raw: true,
        nest: true
      })
      return res.render('admin/products', { product: product.toJSON(), products, status })
    } catch (e) {
      console.log(e)
    }
  },
  // 商品修改
  // put
  editProduct: async (req, res) => {
    try {
      const { name, description, price } = req.body
      const product = await Product.findByPk(req.params.id)
      if (req.file) {
        await Product.create({
          name,
          description,
          price,
          image: req.file.path
        })
      } else {
        await Product.create({
          name,
          description,
          price,
          image: product.image
        })
      }
      return res.redirect('/admin/products')
    } catch (e) {
      console.log(e)
    }
  },
  // 商品刪除
  // delete
  deleteProduct: async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id)
      await product.destroy()
      return res.redirect('back')
    } catch (e) {
      console.log(e)
    }
  },
  // 所有訂單
  // get
  getOrders: async (req, res) => {
    try {
      const orders = await Order.findAll({
        raw: true,
        nest: true
      })
      return res.render('admin/orders', { orders })
    } catch (e) {
      console.log(e)
    }
  },
  // 訂單詳細
  // get
  getOrder: async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id, { include: 'items' })
      return res.render('admin/order', { order: order.toJSON() })
    } catch (e) {
      console.log(e)
    }
  },
  // 訂單運送狀態
  // post
  shipOrder: async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id)
      await order.update({ shipping_status: 1 })
      // 發送 mail
      const user = await User.findByPk(order.UserId)
      const email = user.toJSON().email
      const subject = `[TEST]Diving Park 訂單編號:${order.id} 已出貨!`
      const status = '已出貨 / 已付款'
      const msg = '商品已出貨 再麻煩注意收件地址!'
      nodeMailer.sendMail(email, subject, nodeMailer.sendPayMail(order, status, msg))
    } catch (e) {
      console.log(e)
    }
  },
  // 訂單取消
  // post
  cancelOrder: async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id)
      await order.update({ shipping_status: -1 })
      return res.redirect('back')
    } catch (e) {
      console.log(e)
    }
  },
  // 訂單恢復
  // post
  recoverOrder: async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id)
      await order.update({ shipping_status: 0 })
      return res.redirect('back')
    } catch (e) {
      console.log(e)
    }
  },
  // 取得所有使用者
  // get
  getUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        raw: true,
        nest: true
      })
      return res.render('admin/users', { users })
    } catch (e) {
      console.log(e)
    }
  },
  // 使用者權限修改
  // post
  changeAuth: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id)
      if (user.role === 'admin') {
        await user.update({ role: 'user' })
      } else {
        await user.update({ role: 'admin' })
      }
      return res.redirect('/admin/authority')
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = adminController
