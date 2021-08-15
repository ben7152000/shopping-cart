const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodeMailer = require('../utils/nodemailer')
const db = require('../models')
const User = db.User
const Product = db.Product
const Order = db.Order

const adminController = {
  /*
      功能: 管理者登入頁面
      方法: GET
  */
  signInPage: (req, res) => {
    const { email } = req.session
    return res.render('admin/signin', { email })
  },

  /*
      功能: 管理者登入
      方法: POST
      參數: email, password
  */
  signIn: async (req, res) => {
    try {
      const { email, password } = req.body

      // 尋找管理者
      const user = await User.findOne({ where: { email } })

      // email 錯誤
      if (!user) {
        req.flash('warning_msg', '信箱錯誤')
        return res.redirect('/admin/sign-in')
      }

      // 管理者
      if (user.role !== 'admin') {
        req.flash('danger_msg', '非管理者')
        return res.redirect('/admin/sign-in')
      }

      // 解密
      const hashPassword = await bcrypt.compare(password, user.password)

      // 密碼錯誤
      if (!hashPassword) {
        req.flash('warning_msg', '密碼錯誤')
        return res.redirect('/users/sign-in')
      }

      // 發放 token
      const payload = { id: user.id }
      const expiresIn = { expiresIn: '24h' }
      const token = jwt.sign(payload, process.env.JWT_SECRET, expiresIn)

      // 存入 session
      req.session.email = email
      req.session.token = token

      req.flash('success_msg', '登出成功')
      return res.redirect('/admin/products')
    } catch (e) {
      console.log(e)
    }
  },

  /*
      功能: 管理者登出
      方法: GET
  */
  signOut: (req, res) => {
    req.logout()
    req.session.email = ''
    req.session.token = ''
    return res.redirect('/admin/sign-in')
  },

  /*
     功能: 所有產品頁面
     方法: GET
  */
  getProducts: async (req, res) => {
    try {
      const products = await Product.findAll({ raw: true, nest: true })
      return res.render('admin/products', { products })
    } catch (e) {
      console.log(e)
    }
  },

  /*
     功能: 註冊商品
     方法: POST
     參數: name, description, price, image
  */
  postProducts: async (req, res) => {
    try {
      const file = req.file
      if (!file) {
        await Product.create({ ...req.body })
        return res.redirect('back')
      }
      await Product.create({
        ...req.body,
        image: `/upload/${req.file.filename}`
      })
      return res.redirect('back')
    } catch (e) {
      console.log(e)
    }
  },

  /*
     功能: 商品詳細
     方法: GET
  */
  getProduct: async (req, res) => {
    try {
      const status = 1
      const id = req.params.id
      const [product, products] = await Promise.all([
        Product.findByPk(id),
        Product.findAll({ raw: true, nest: true })
      ])
      return res.render('admin/products', { product: product.toJSON(), products, status })
    } catch (e) {
      console.log(e)
    }
  },

  /*
     功能: 商品修改
     方法: PUT
     參數: name, description, price, image
  */
  editProduct: async (req, res) => {
    try {
      const id = req.params.id
      const product = await Product.findByPk(id)
      const file = req.file
      if (!file) {
        await product.update({ ...req.body })
        return res.redirect('/admin/products')
      }
      await product.update({
        ...req.body,
        image: req.file.originalname
      })
      return res.redirect('/admin/products')
    } catch (e) {
      console.log(e)
    }
  },

  /*
     功能: 商品刪除
     方法: DELETE
  */
  deleteProduct: async (req, res) => {
    try {
      const id = req.params.id
      const product = await Product.findByPk(id)
      await product.destroy()
      return res.redirect('back')
    } catch (e) {
      console.log(e)
    }
  },

  /*
     功能: 所有訂單
     方法: GET
  */
  getOrders: async (req, res) => {
    try {
      const orders = await Order.findAll({ raw: true, nest: true })
      return res.render('admin/orders', { orders })
    } catch (e) {
      console.log(e)
    }
  },

  /*
     功能: 訂單詳細
     方法: GET
  */
  getOrder: async (req, res) => {
    try {
      const id = req.params.id
      const order = await Order.findByPk(id, { include: 'items' })
      return res.render('admin/order', { order: order.toJSON() })
    } catch (e) {
      console.log(e)
    }
  },

  /*
     功能: 訂單運送狀態
     方法: POST
     參數: params.id
  */
  shipOrder: async (req, res) => {
    try {
      const id = req.params.id
      const order = await Order.findByPk(id)
      await order.update({ shipping_status: 1 })
      // 發送 mail
      const user = await User.findByPk(order.UserId)
      const email = user.toJSON().email
      const subject = `[TEST]Diving Park 訂單編號:${order.id} 已出貨!`
      const status = '已出貨 / 已付款'
      const msg = '商品已出貨 再麻煩注意收件地址!'
      nodeMailer.sendMail(email, subject, nodeMailer.sendPayMail(order, status, msg))
      return res.redirect('back')
    } catch (e) {
      console.log(e)
    }
  },

  /*
     功能: 訂單取消
     方法: POST
     參數: params.id
  */
  cancelOrder: async (req, res) => {
    try {
      const id = req.params.id
      const order = await Order.findByPk(id)
      await order.update({ shipping_status: -1 })
      return res.redirect('back')
    } catch (e) {
      console.log(e)
    }
  },

  /*
     功能: 訂單恢復
     方法: POST
     參數: params.id
  */
  recoverOrder: async (req, res) => {
    try {
      const id = req.params.id
      const order = await Order.findByPk(id)
      await order.update({ shipping_status: 0 })
      return res.redirect('back')
    } catch (e) {
      console.log(e)
    }
  },

  /*
     功能: 取得所有使用者
     方法: GET
  */
  getUsers: async (req, res) => {
    try {
      const users = await User.findAll({ raw: true, nest: true })
      return res.render('admin/users', { users })
    } catch (e) {
      console.log(e)
    }
  },

  /*
     功能: 使用者權限修改
     方法: POST
     參數: params.id
  */
  changeAuth: async (req, res) => {
    try {
      const id = req.params.id
      const user = await User.findByPk(id)
      user.role === 'admin' ? await user.update({ role: 'user' }) : await user.update({ role: 'admin' })
      return res.redirect('/admin/authority')
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = adminController
