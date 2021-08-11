'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate (models) {
      Payment.belongsTo(models.Order)
    }
  }
  Payment.init({
    amount: DataTypes.INTEGER,
    sn: DataTypes.INTEGER,
    payment_method: DataTypes.STRING,
    paid_at: DataTypes.DATE,
    params: DataTypes.TEXT,
    OrderId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Payment'
  })
  return Payment
}
