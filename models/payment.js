'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate (models) {
      Payment.belongsTo(models.Order)
    }
  }
  Payment.init({
    OrderId: DataTypes.INTEGER,
    payment_method: DataTypes.STRING,
    isSuccess: DataTypes.BOOLEAN,
    failure_message: DataTypes.TEXT,
    payTime: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Payment'
  })
  return Payment
}
