const express = require('express');
const { sequelize } = require('./models');
const usersRouter = require('./routes/users');
const busesRouter = require('./routes/buses');

const app = express();
app.use(express.json());

app.get('/', (req, res) => res.json({ status: 'ok', service: 'bus-booking-system' }));
app.use('/users', usersRouter);
app.use('/buses', busesRouter);

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON body' });
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ error: err.errors.map((e) => e.message).join(', ') });
  }
  console.error(err);
  res.status(500).json({ error: err.message });
});

async function start() {
  const PORT = Number(process.env.PORT) || 3000;
  try {
    await sequelize.authenticate();
    await sequelize.sync();
  } catch (err) {
    console.error(`Unable to connect to the database: ${err.message}`);
    process.exit(1);
  }

  const server = app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

  const shutdown = () => server.close(async () => {
    await sequelize.close();
    console.log('Database connection closed');
    process.exit(0);
  });
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

if (require.main === module) start();

module.exports = app;
