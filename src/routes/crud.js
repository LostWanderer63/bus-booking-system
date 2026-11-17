const express = require('express');
const { pool, log } = require('../db');

function crudRouter(table, columns) {
  const router = express.Router();

  const pick = (body) =>
    Object.fromEntries(columns.filter((c) => body[c] !== undefined).map((c) => [c, body[c]]));

  router.param('id', (req, res, next, id) => {
    if (!/^\d+$/.test(id)) return res.status(400).json({ error: 'id must be a positive integer' });
    req.recordId = Number(id);
    next();
  });

  router.get('/', async (req, res, next) => {
    try {
      const [rows] = await pool.query(`SELECT * FROM ${table}`);
      res.json(rows);
    } catch (err) { next(err); }
  });

  router.get('/:id', async (req, res, next) => {
    try {
      const [rows] = await pool.query(`SELECT * FROM ${table} WHERE id = ?`, [req.recordId]);
      if (!rows.length) return res.status(404).json({ error: `${table} record with id ${req.recordId} not found` });
      res.json(rows[0]);
    } catch (err) { next(err); }
  });

  router.post('/', async (req, res, next) => {
    try {
      const data = pick(req.body || {});
      if (!Object.keys(data).length) return res.status(400).json({ error: `Provide: ${columns.join(', ')}` });
      const [result] = await pool.query(`INSERT INTO ${table} SET ?`, [data]);
      log('INSERT', table, { id: result.insertId, ...data });
      res.status(201).json({ message: `${table} record created`, id: result.insertId, ...data });
    } catch (err) {
      log('INSERT FAILED', table, { error: err.sqlMessage || err.message });
      next(err);
    }
  });

  router.put('/:id', async (req, res, next) => {
    try {
      const data = pick(req.body || {});
      if (!Object.keys(data).length) return res.status(400).json({ error: `Provide: ${columns.join(', ')}` });
      const [result] = await pool.query(`UPDATE ${table} SET ? WHERE id = ?`, [data, req.recordId]);
      if (!result.affectedRows) {
        log('UPDATE NOT FOUND', table, { id: req.recordId });
        return res.status(404).json({ error: `${table} record with id ${req.recordId} not found` });
      }
      log('UPDATE', table, { id: req.recordId, ...data });
      res.json({ message: `${table} record updated`, id: req.recordId, ...data });
    } catch (err) {
      log('UPDATE FAILED', table, { id: req.recordId, error: err.sqlMessage || err.message });
      next(err);
    }
  });

  router.delete('/:id', async (req, res, next) => {
    try {
      const [result] = await pool.query(`DELETE FROM ${table} WHERE id = ?`, [req.recordId]);
      if (!result.affectedRows) {
        log('DELETE NOT FOUND', table, { id: req.recordId });
        return res.status(404).json({ error: `${table} record with id ${req.recordId} not found` });
      }
      log('DELETE', table, { id: req.recordId });
      res.json({ message: `${table} record deleted`, id: req.recordId });
    } catch (err) {
      log('DELETE FAILED', table, { id: req.recordId, error: err.sqlMessage || err.message });
      next(err);
    }
  });

  return router;
}

module.exports = crudRouter;
