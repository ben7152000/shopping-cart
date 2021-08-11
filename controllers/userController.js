const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../models')
const User = db.User
const nodeMailer = require('../utils/nodemailer')

const userController = {
  // 登入頁面
  // get
  signInPage: (req, res) => {
    const front = true
    const { email } = req.session
    return res.render('admin/signin', { email, front })
  },
  // 登入
  // post
  // email, password
  signIn: async (req, res) => {
    try {
      const { email, password } = req.body

      // 尋找使用者
      const user = await User.findOne({ where: { email } })

      // email 錯誤
      if (!user) {
        return res.redirect('/users/sign-in')
      }

      // 一般使用者
      if (user.role !== 'user') {
        return res.redirect('/users/sign-in')
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

      return res.redirect('/product')
    } catch (e) {
      console.log(e)
    }
  },
  // 登出
  // get
  signOut: (req, res) => {
    req.logout()
    req.session.email = ''
    req.session.token = ''
    req.session.cartId = ''
    return res.redirect('/users/sign-in')
  },
  // 註冊頁面
  // get
  signUpPage: (req, res) => {
    const { email } = req.session
    return res.render('signup', { email })
  },
  // 註冊
  // post
  // email, password, confirmPassword, captcha
  signUp: async (req, res) => {
    try {
      const { email, password, confirmPassword, captcha } = req.body

      // 校驗
      // 不得為空
      if (!email || !password || !confirmPassword || !captcha) {
        return res.redirect('back')
      }
      // 兩個密碼要相同
      if (password !== confirmPassword) {
        return res.redirect('back')
      }
      // 驗證碼要相同
      if (req.session.captcha !== captcha) {
        return res.redirect('back')
      }

      const user = await User.findOne({ where: { email } })
      // 使用者重複
      if (user) {
        return res.redirect('back')
      }

      // 加密
      const salt = await bcrypt.genSalt(10)
      const hashPassword = await bcrypt.hashSync(password, salt)

      // 建立使用者
      await User.create({
        email,
        password: hashPassword,
        role: user
      })

      // 清空 captcha
      req.session.captcha = ''

      return res.redirect('/users/sign-in')
    } catch (e) {
      console.log(e)
    }
  },
  // 傳送驗證碼
  // post
  // email
  sendCaptcha: (req, res) => {
    const { email } = req.body

    // 隨機產生驗證碼 6 碼
    const captcha = Math.random().toFixed(6).slice(-6)
    const subject = `[TEST]Diving Park購物網 註冊驗證碼: ${captcha}`
    nodeMailer.sendMail(email, subject, nodeMailer.sendCaptchaMail(captcha))

    // 暫存 session
    req.session.email = email
    req.session.captcha = captcha

    return res.redirect('/users/sign-up')
  }
}

module.exports = userController
