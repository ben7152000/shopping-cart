'use strict'

const bcrypt = require('bcrypt')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }])
    await queryInterface.bulkInsert('Users',
      Array.from({ length: 3 })
        .map((item, index) => ({
          email: `user${index + 1}@example.com`,
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date()
        })), {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
