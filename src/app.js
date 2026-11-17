const express = require('express');
require('dotenv').config();
const crudRouter = require('./routes/crud');
const { testConnection, closePool } = require('./db');

const app = express();
app.use(express.json());

app.get('/', (req, res) => res.json({ status: 'ok', service: 'bus-booking-system' }));

app.use('/users', crudRouter('Users', ['name', 'email']));
app.use('/buses', crudRouter('Buses', ['busNumber', 'totalSeats', 'availableSeats']));
app.use('/bookings', crudRouter('Bookings', ['seatNumber']));
app.use('/payments', crudRouter('Payments', ['amountPaid', 'paymentStatus']));

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON body' });
  const clientErrors = ['ER_DUP_ENTRY', 'ER_CHECK_CONSTRAINT_VIOLATED', 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD', 'WARN_DATA_TRUNCATED', 'ER_BAD_NULL_ERROR', 'ER_NO_DEFAULT_FOR_FIELD', 'ER_DATA_TOO_LONG'];
  const status = clientErrors.includes(err.code) ? 400 : 500;
  if (status === 500) console.error('[ERROR]', err);
  res.status(status).json({ error: err.sqlMessage || err.message });
});

async function start() {
  const PORT = Number(process.env.PORT) || 3000;
  try {
    await testConnection();
  } catch (err) {
    console.error(`[DB] Unable to connect to MySQL: ${err.message}`);
    await closePool().catch(() => {});
    process.exit(1);
  }

  const server = app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

  const shutdown = (signal) => {
    console.log(`${signal} received, shutting down`);
    server.close(async () => {
      await closePool();
      process.exit(0);
    });
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

if (require.main === module) start();

module.exports = app;
