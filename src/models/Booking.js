const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Booking = sequelize.define('Booking', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  seatNumber: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  busId: { type: DataTypes.INTEGER, allowNull: false },
}, {
  tableName: 'Bookings',
  timestamps: false,
  indexes: [{ unique: true, fields: ['busId', 'seatNumber'] }],
});

module.exports = Booking;
