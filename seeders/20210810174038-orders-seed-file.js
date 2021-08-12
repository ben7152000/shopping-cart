'use strict'

const faker = require('faker')
const db = require('../models')
const User = db.User

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll({ where: { role: 'user' } })
    await queryInterface.bulkInsert('Orders',
      Array.from({ length: 2 })
        .map((item, index) => ({
          UserId: users[Math.floor(Math.random() * users.length)].id,
          name: faker.commerce.productName(),
          phone: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          amount: faker.random.number(),
          sn: faker.random.number().toString(),
          shipping_status: Math.floor(Math.random()),
          payment_status: Math.floor(Math.random()),
          createdAt: new Date(),
          updatedAt: new Date()
        })
        ), {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Orders', null, {})
  }
}
