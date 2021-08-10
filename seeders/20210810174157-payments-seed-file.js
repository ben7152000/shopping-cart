'use strict'

const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    return queryInterface.bulkInsert('Payments',
      Array.from({ length: 5 })
        .map((item, index) =>
          ({
            amount: faker.random.number(),
            sn: faker.random.number(),
            payment_method: Math.floor(Math.random() * 3) + 1,
            paid_at: new Date(),
            params: null,
            OrderId: Math.floor(Math.random() * 2) + 1,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        ), {})
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
}
