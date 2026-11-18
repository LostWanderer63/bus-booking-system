const { sequelize, User, Bus, Booking } = require('../src/models');

const users = [
  { name: 'Rahul Verma', email: 'rahul.verma@example.com' },
  { name: 'Sneha Reddy', email: 'sneha.reddy@example.com' },
  { name: 'Karan Mehta', email: 'karan.mehta@example.com' },
];

const buses = [
  { busNumber: 'GJ-01-MN-1122', totalSeats: 40, availableSeats: 25 },
  { busNumber: 'RJ-14-PQ-3344', totalSeats: 30, availableSeats: 6 },
];

const bookings = [
  { email: 'rahul.verma@example.com', busNumber: 'GJ-01-MN-1122', seatNumber: 4 },
  { email: 'rahul.verma@example.com', busNumber: 'RJ-14-PQ-3344', seatNumber: 11 },
  { email: 'sneha.reddy@example.com', busNumber: 'GJ-01-MN-1122', seatNumber: 5 },
  { email: 'karan.mehta@example.com', busNumber: 'GJ-01-MN-1122', seatNumber: 20 },
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

async function createBookings() {
  for (const { email, busNumber, seatNumber } of bookings) {
    const user = await User.findOne({ where: { email } });
    const bus = await Bus.findOne({ where: { busNumber } });
    const [booking, created] = await Booking.findOrCreate({
      where: { busId: bus.id, seatNumber },
      defaults: { userId: user.id },
    });
    if (created) await bus.decrement('availableSeats');
    console.log(`${created ? 'Created' : 'Skipped existing'} Booking ${booking.id} (user ${user.id}, bus ${bus.id}, seat ${seatNumber})`);
  }
}

async function main() {
  await sequelize.sync();
  await createAll(User, users);
  await createAll(Bus, buses);
  await createBookings();
}

main()
  .catch((err) => { console.error(err.message); process.exitCode = 1; })
  .finally(() => sequelize.close());
