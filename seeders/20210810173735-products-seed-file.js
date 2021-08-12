'use strict'

const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Products',
      Array.from({ length: 50 })
        .map((item, index) =>
          ({
            id: index + 1,
            name: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: faker.commerce.price(),
            image: `https://loremflickr.com/320/240/object/?lock=${Math.random() * 1000}`,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        ), {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Products', null, {})
  }
}
