'use strict'

const db = require('../models')
const Order = db.Order
const Product = db.Product

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const orders = await Order.findAll({ raw: true, nest: true })
    const products = await Product.findAll({ raw: true, nest: true })
    await queryInterface.bulkInsert('OrderItems',
      Array.from({ length: 10 })
        .map((item, index) =>
          ({
            OrderId: orders[Math.floor(Math.random() * 2)].id,
            ProductId: products[Math.floor(Math.random() * 10)].id,
            price: Math.floor(Math.random() * 500) + 1,
            quantity: Math.floor(Math.random() * 10) + 1,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        ), {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('OrderItems', null, {})
  }
}
