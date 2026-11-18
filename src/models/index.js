const sequelize = require('../config/database');
const User = require('./User');
const Bus = require('./Bus');
const Booking = require('./Booking');
const Payment = require('./Payment');

module.exports = { sequelize, User, Bus, Booking, Payment };
