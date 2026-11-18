const express = require('express');
const { User, Bus, Booking } = require('../models');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.create({ name, email });
    console.log(`INSERT: user ${user.id} created`);
    res.status(201).json(user);
  } catch (err) { next(err); }
});

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) { next(err); }
});

router.get('/:id/bookings', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const bookings = await Booking.findAll({
      where: { userId: user.id },
      attributes: ['id', 'seatNumber'],
      include: [{ model: Bus, as: 'bus', attributes: ['busNumber'] }],
    });
    res.json(bookings);
  } catch (err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      console.log(`UPDATE: user ${req.params.id} not found`);
      return res.status(404).json({ error: 'User not found' });
    }
    const { name, email } = req.body;
    await user.update({ name, email });
    console.log(`UPDATE: user ${user.id} updated`);
    res.json(user);
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await User.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      console.log(`DELETE: user ${req.params.id} not found`);
      return res.status(404).json({ error: 'User not found' });
    }
    console.log(`DELETE: user ${req.params.id} deleted`);
    res.json({ message: `User ${req.params.id} deleted` });
  } catch (err) { next(err); }
});

module.exports = router;
