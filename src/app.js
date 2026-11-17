const express = require('express');
require('dotenv').config();
const crudRouter = require('./routes/crud');

const app = express();
app.use(express.json());

app.get('/', (req, res) => res.json({ status: 'ok', service: 'bus-booking-system' }));

app.use('/users', crudRouter('Users', ['name', 'email']));
app.use('/buses', crudRouter('Buses', ['busNumber', 'totalSeats', 'availableSeats']));
app.use('/bookings', crudRouter('Bookings', ['seatNumber']));
app.use('/payments', crudRouter('Payments', ['amountPaid', 'paymentStatus']));

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

app.use((err, req, res, next) => {
  const clientErrors = ['ER_DUP_ENTRY', 'ER_CHECK_CONSTRAINT_VIOLATED', 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD', 'WARN_DATA_TRUNCATED', 'ER_BAD_NULL_ERROR', 'ER_NO_DEFAULT_FOR_FIELD'];
  const status = clientErrors.includes(err.code) ? 400 : 500;
  res.status(status).json({ error: err.sqlMessage || err.message });
});

const PORT = Number(process.env.PORT) || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

module.exports = app;
