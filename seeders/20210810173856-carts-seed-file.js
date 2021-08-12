'use strict'

const db = require('../models')
const User = db.User

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll({ where: { role: 'user' } })
    await queryInterface.bulkInsert('Carts',
      Array.from({ length: 3 })
        .map((item, index) => ({
          id: index + 1,
          UserId: users[Math.floor(Math.random() * users.length)].id,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        ), {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Carts', null, {})
  }
}
