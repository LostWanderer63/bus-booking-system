const express = require('express');
const { pool } = require('../db');

const router = express.Router();

router.get('/available/:seats', async (req, res, next) => {
  const { seats } = req.params;
  if (!/^\d+$/.test(seats)) return res.status(400).json({ error: 'seats must be a non-negative integer' });

  try {
    const [rows] = await pool.query(
      'SELECT id, busNumber, totalSeats, availableSeats FROM Buses WHERE availableSeats > ?',
      [Number(seats)]
    );
    console.log(`[DB] ${new Date().toISOString()} SELECT Buses {"availableSeats >":${seats},"count":${rows.length}}`);
    res.json(rows);
  } catch (err) { next(err); }
});

module.exports = router;
