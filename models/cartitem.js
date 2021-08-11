'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    static associate (models) {}
  }
  CartItem.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    CartId: DataTypes.INTEGER,
    ProductId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CartItem'
  })
  return CartItem
}
