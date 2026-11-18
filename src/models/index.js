const sequelize = require('../config/database');
const User = require('./User');
const Bus = require('./Bus');
const Booking = require('./Booking');
const Payment = require('./Payment');

User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings', onDelete: 'CASCADE' });
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Bus.hasMany(Booking, { foreignKey: 'busId', as: 'bookings', onDelete: 'CASCADE' });
Booking.belongsTo(Bus, { foreignKey: 'busId', as: 'bus' });

module.exports = { sequelize, User, Bus, Booking, Payment };
