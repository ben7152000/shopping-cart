'use strict'

const db = require('../models')
const User = db.User

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll({ where: { role: 'user' } })
    await queryInterface.bulkInsert('Carts', [
      {
        id: 1,
        UserId: users[0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Carts', null, {})
  }
}
