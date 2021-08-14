'use strict'

const db = require('../models')
const Product = db.Product
const Cart = db.Cart

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const products = await Product.findAll({ raw: true, nest: true })
    const carts = await Cart.findAll({ raw: true, nest: true })
    await queryInterface.bulkInsert('CartItems', [
      {
        CartId: carts[0].id,
        ProductId: products[Math.floor(Math.random() * 10)].id,
        quantity: Math.floor(Math.random() * 5) + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('cartItems', null, {})
  }
}
