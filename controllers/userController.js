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
        req.flash('warning_msg', '信箱錯誤')
        return res.redirect('/users/sign-in')
      }

      // 一般使用者
      if (user.role !== 'user') {
        req.flash('danger_msg', '權限不足')
        return res.redirect('/users/sign-in')
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

      req.flash('success_msg', '登入成功')
      return res.redirect('/products')
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
    req.flash('success_msg', '登出成功')
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
        req.flash('warning_msg', '全部欄位都要填寫')
        return res.redirect('back')
      }
      // 兩個密碼要相同
      if (password !== confirmPassword) {
        req.flash('warning_msg', '密碼不相同')
        return res.redirect('back')
      }
      // 驗證碼要相同
      if (req.session.captcha !== captcha) {
        req.flash('warning_msg', '驗證碼錯誤')
        return res.redirect('back')
      }

      const user = await User.findOne({ where: { email } })
      // 使用者重複
      if (user) {
        req.flash('warning_msg', '帳號註冊過了')
        return res.redirect('back')
      }

      // 加密
      const salt = await bcrypt.genSalt(10)
      const hashPassword = await bcrypt.hashSync(password, salt)

      // 建立使用者
      await User.create({
        email,
        password: hashPassword,
        role: 'user'
      })

      // 清空 captcha
      req.session.captcha = ''

      req.flash('success_msg', '註冊成功')
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

    req.flash('success_msg', `驗證碼已發送至此信箱:${email}`)
    return res.redirect('/users/sign-up')
  }
}

module.exports = userController
