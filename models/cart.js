'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate (models) {
      Cart.belongsToMany(models.Product, {
        as: 'items',
        through: {
          model: models.CartItem, unique: false
        },
        foreignKey: 'CartId'
      })
    }
  }
  Cart.init({
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Cart'
  })
  return Cart
}
