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
    return queryInterface.bulkInsert('Orders',
      Array.from({ length: 2 })
        .map((item, index) => ({
          name: faker.commerce.productName(),
          phone: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          amount: faker.random.number(),
          sn: faker.random.number(),
          shipping_status: Math.floor(Math.random()),
          payment_status: Math.floor(Math.random()),
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
