const CryptoJS = require('crypto-js')

const URL = process.env.NEWEBPAY_URL
const MerchantID = process.env.NEWEBPAY_MERCHANT_ID
const HashKey = process.env.NEWEBPAY_HASH_KEY
const HashIV = process.env.NEWEBPAY_HASH_IV
const PayGateWay = 'https://ccore.spgateway.com/MPG/mpg_gateway'
const ReturnURL = URL + '/spgateway/callback?from=ReturnURL'
const NotifyURL = URL + '/spgateway/callback?from=NotifyURL'
const ClientBackURL = URL + '/orders'

// 串接資訊
function genDataChain (data) {
  const results = []
  for (const kv of Object.entries(data)) {
    results.push(`${kv[0]}=${kv[1]}`)
  }
  return results.join('&')
}

// AES
function TradeInfoAES (data) {
  const dataChain = genDataChain(data)
  const key = CryptoJS.enc.Utf8.parse(HashKey)
  const iv = CryptoJS.enc.Utf8.parse(HashIV)
  const tradeInfoAES = CryptoJS.AES.encrypt(dataChain, key, { iv })
  return tradeInfoAES.ciphertext.toString()
}

// SHA
function tradeInfoSHA (data) {
  const tradeInfoAES = TradeInfoAES(data)
  const tradeInfoSHA = CryptoJS.SHA256(`HashKey=${HashKey}&${tradeInfoAES}&HashIV=${HashIV}`).toString().toUpperCase()
  return tradeInfoSHA
}

const mpgData = {
  // 取得資訊
  getData: (amount, productDesc, email) => {
    const data = {
      MerchantID: MerchantID, // 商店代號
      RespondType: 'JSON', // 回傳格式
      TimeStamp: Date.now(), // 時間戳記
      Version: 1.6, // 串接程式版本
      MerchantOrderNo: Date.now(), // 商店訂單編號
      Amt: amount, // 訂單金額
      ItemDesc: productDesc, // 產品名稱
      TradeLimit: 600, // 追蹤時間
      Email: email, // 付款人電子信箱
      ReturnURL: ReturnURL, // 支付完成返回商店網址
      NotifyURL: NotifyURL, // 支付通知網址/每期授權結果通知
      ClientBackURL: ClientBackURL, // 支付取消返回商店網址
      LoginType: 0, // 智付通會員
      OrderComment: '已進入付款頁面，請小心資料外洩' // 商店備註
    }
    return {
      MerchantID: MerchantID,
      TradeInfo: TradeInfoAES(data),
      TradeSha: tradeInfoSHA(data),
      Version: 1.6, // 串接程式版本
      PayGateWay: PayGateWay,
      MerchantOrderNo: data.MerchantOrderNo
    }
  },
  // 解密
  decryptData: (data) => {
    const key = CryptoJS.enc.Utf8.parse(HashKey)
    const iv = CryptoJS.enc.Utf8.parse(HashIV)
    const encryptedHexStr = CryptoJS.enc.Hex.parse(data)
    const encryptedData = CryptoJS.enc.Base64.stringify(encryptedHexStr)
    const decryptData = CryptoJS.AES.decrypt(encryptedData, key, { iv })
    return decryptData.toString(CryptoJS.enc.Utf8)
  }
}

module.exports = mpgData
