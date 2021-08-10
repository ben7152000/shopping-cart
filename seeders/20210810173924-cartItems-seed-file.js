'use strict'

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
    return queryInterface.bulkInsert('CartItems',
      Array.from({ length: 20 })
        .map((item, index) =>
          ({
            CartId: Math.floor(Math.random() * 3) + 1,
            ProductId: Math.floor(Math.random() * 10) + 1,
            quantity: Math.floor(Math.random() * 5) + 1,
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
