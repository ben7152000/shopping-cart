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
    return queryInterface.bulkInsert('Products',
      Array.from({ length: 10 })
        .map((item, index) =>
          ({
            id: index + 1,
            name: faker.commerce.productName(),
            description: faker.commerce.product() + '/' + faker.commerce.productName(),
            price: faker.commerce.price(),
            image: faker.image.imageUrl(),
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
