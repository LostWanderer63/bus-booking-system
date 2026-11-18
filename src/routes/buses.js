const express = require('express');
const { Op } = require('sequelize');
const { Bus } = require('../models');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { busNumber, totalSeats, availableSeats } = req.body;
    const bus = await Bus.create({ busNumber, totalSeats, availableSeats });
    console.log(`INSERT: bus ${bus.id} created`);
    res.status(201).json(bus);
  } catch (err) { next(err); }
});

router.get('/available/:seats', async (req, res, next) => {
  const seats = Number(req.params.seats);
  if (!Number.isInteger(seats) || seats < 0) {
    return res.status(400).json({ error: 'seats must be a non-negative integer' });
  }
  try {
    const buses = await Bus.findAll({ where: { availableSeats: { [Op.gt]: seats } } });
    res.json(buses);
  } catch (err) { next(err); }
});

module.exports = router;
