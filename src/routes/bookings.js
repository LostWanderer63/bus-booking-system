const express = require('express');
const { sequelize, User, Bus, Booking } = require('../models');

const router = express.Router();

router.post('/', async (req, res, next) => {
  const { userId, busId, seatNumber } = req.body;
  if (!userId || !busId || !seatNumber) {
    return res.status(400).json({ error: 'userId, busId and seatNumber are required' });
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const bus = await Bus.findByPk(busId);
    if (!bus) return res.status(404).json({ error: 'Bus not found' });
    if (seatNumber < 1 || seatNumber > bus.totalSeats) {
      return res.status(400).json({ error: `seatNumber must be between 1 and ${bus.totalSeats}` });
    }
    if (bus.availableSeats < 1) return res.status(409).json({ error: 'No seats available on this bus' });

    const taken = await Booking.findOne({ where: { busId, seatNumber } });
    if (taken) return res.status(409).json({ error: `Seat ${seatNumber} is already booked on this bus` });

    const booking = await sequelize.transaction(async (t) => {
      const created = await Booking.create({ userId, busId, seatNumber }, { transaction: t });
      await bus.decrement('availableSeats', { transaction: t });
      return created;
    });

    console.log(`INSERT: booking ${booking.id} created (user ${userId}, bus ${busId}, seat ${seatNumber})`);
    res.status(201).json(booking);
  } catch (err) { next(err); }
});

module.exports = router;
