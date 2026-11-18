const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  amountPaid: { type: DataTypes.DECIMAL(10, 2), allowNull: false, validate: { min: 0 } },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'success', 'failed'),
    allowNull: false,
    defaultValue: 'pending',
  },
}, { tableName: 'Payments', timestamps: false });

module.exports = Payment;
