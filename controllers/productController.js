const db = require('../models')
const Product = db.Product

const productController = {
  // 取所有產品
  getProducts: async (req, res) => {
    try {
      const products = await Product.findAndCountAll({ offset: 0, limit: 3 })
      return res.render('products', { products })
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = productController
