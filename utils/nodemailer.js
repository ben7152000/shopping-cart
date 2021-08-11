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
  }
}

module.exports = nodeMailer
