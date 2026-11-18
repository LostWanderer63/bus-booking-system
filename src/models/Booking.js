const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Booking = sequelize.define('Booking', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  seatNumber: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
}, { tableName: 'Bookings', timestamps: false });

module.exports = Booking;
