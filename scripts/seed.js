const { sequelize, User, Bus } = require('../src/models');

const users = [
  { name: 'Rahul Verma', email: 'rahul.verma@example.com' },
  { name: 'Sneha Reddy', email: 'sneha.reddy@example.com' },
  { name: 'Karan Mehta', email: 'karan.mehta@example.com' },
];

const buses = [
  { busNumber: 'GJ-01-MN-1122', totalSeats: 40, availableSeats: 25 },
  { busNumber: 'RJ-14-PQ-3344', totalSeats: 30, availableSeats: 6 },
];

async function createAll(Model, records) {
  for (const record of records) {
    try {
      const row = await Model.create(record);
      console.log(`Created ${Model.name} ${row.id}`);
    } catch (err) {
      if (err.name !== 'SequelizeUniqueConstraintError') throw err;
      console.log(`${Model.name} already exists, skipped`);
    }
  }
}

async function main() {
  await sequelize.sync();
  await createAll(User, users);
  await createAll(Bus, buses);
}

main()
  .catch((err) => { console.error(err.message); process.exitCode = 1; })
  .finally(() => sequelize.close());
