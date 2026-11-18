const { Op } = require('sequelize');
const { sequelize, User, Bus } = require('../src/models');

async function main() {
  const users = await User.findAll({ raw: true });
  console.log('All users:');
  console.table(users);

  const buses = await Bus.findAll({ where: { availableSeats: { [Op.gt]: 10 } }, raw: true });
  console.log('Buses with more than 10 available seats:');
  console.table(buses);
}

main()
  .catch((err) => { console.error(err.message); process.exitCode = 1; })
  .finally(() => sequelize.close());
