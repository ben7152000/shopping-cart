'use strict'

const db = require('../models')
const User = db.User

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll({ where: { role: 'user' } })
    await queryInterface.bulkInsert('Orders', [
      {
        UserId: users[0].id,
        name: 'YU CHENG CHOU',
        phone: '0915768987',
        address: '新北市中和區某某街某某巷某某弄某某樓',
        amount: 49500,
        sn: '123456',
        shipping_status: 1,
        payment_status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Orders', null, {})
  }
}
