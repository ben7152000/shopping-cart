const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_ACCOUNT,
    pass: process.env.GMAIL_PASSWORD
  }
})

const nodeMailer = {
  sendMail: (mail, subject, text) => {
    const mailOptions = {
      from: process.env.USER_MAIL,
      to: mail,
      subject,
      text
    }

    transporter.sendMail(mailOptions, (error, info) => {
      error ? console.log(error) : console.log('Email sent: ' + info.response)
    })
  },
  sendCaptchaMail: (captcha) => {
    return `
    <h3>請於 Diving Park 註冊頁輸入您的驗證碼</h3>
    <h1>${captcha}</h1>
  `
  }
}

module.exports = nodeMailer
