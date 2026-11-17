const express = require('express');
const pool = require('../db');

// Builds standard CRUD routes for a table with a whitelisted set of columns.
function crudRouter(table, columns) {
  const router = express.Router();

  const pick = (body) =>
    Object.fromEntries(columns.filter((c) => body[c] !== undefined).map((c) => [c, body[c]]));

  router.get('/', async (req, res, next) => {
    try {
      const [rows] = await pool.query(`SELECT * FROM ${table}`);
      res.json(rows);
    } catch (err) { next(err); }
  });

  router.get('/:id', async (req, res, next) => {
    try {
      const [rows] = await pool.query(`SELECT * FROM ${table} WHERE id = ?`, [req.params.id]);
      if (!rows.length) return res.status(404).json({ error: `${table} record not found` });
      res.json(rows[0]);
    } catch (err) { next(err); }
  });

  router.post('/', async (req, res, next) => {
    try {
      const data = pick(req.body || {});
      if (!Object.keys(data).length) return res.status(400).json({ error: `Provide: ${columns.join(', ')}` });
      const [result] = await pool.query(`INSERT INTO ${table} SET ?`, [data]);
      res.status(201).json({ id: result.insertId, ...data });
    } catch (err) { next(err); }
  });

  router.put('/:id', async (req, res, next) => {
    try {
      const data = pick(req.body || {});
      if (!Object.keys(data).length) return res.status(400).json({ error: `Provide: ${columns.join(', ')}` });
      const [result] = await pool.query(`UPDATE ${table} SET ? WHERE id = ?`, [data, req.params.id]);
      if (!result.affectedRows) return res.status(404).json({ error: `${table} record not found` });
      res.json({ id: Number(req.params.id), ...data });
    } catch (err) { next(err); }
  });

  router.delete('/:id', async (req, res, next) => {
    try {
      const [result] = await pool.query(`DELETE FROM ${table} WHERE id = ?`, [req.params.id]);
      if (!result.affectedRows) return res.status(404).json({ error: `${table} record not found` });
      res.status(204).end();
    } catch (err) { next(err); }
  });

  return router;
}

module.exports = crudRouter;
