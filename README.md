# Bus Booking System

Express API for a bus booking system using **Sequelize** (MySQL).

## Setup

```bash
npm install
cp .env.example .env              # add your MySQL credentials
mysql -u <user> -p < schema.sql   # creates the bus_booking database
npm run seed                      # adds 3 users, 2 buses and 4 bookings
npm start                         # http://localhost:3000
```

## Models

`src/models/` defines `User`, `Bus`, `Booking` and `Payment`, mapped to the
`Users`, `Buses`, `Bookings` and `Payments` tables.

## Associations and foreign keys

A **foreign key** is a column in one table that stores the primary key of a row in another table.
It links the two rows, and the database refuses values that don't point to a real row, so a booking
can never reference a user or bus that doesn't exist.

`Bookings` has two foreign keys:

- `userId` → `Users.id`: one user can make many bookings
- `busId` → `Buses.id`: one bus can have many bookings

```js
User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Bus.hasMany(Booking, { foreignKey: 'busId', as: 'bookings' });
Booking.belongsTo(Bus, { foreignKey: 'busId', as: 'bus' });
```

These associations let Sequelize join related tables with `include`, e.g.
`Booking.findAll({ where: { userId }, include: [{ model: Bus, as: 'bus' }] })`.
Deleting a user or bus also deletes its bookings (`ON DELETE CASCADE`), and a seat can only be
booked once per bus. Creating a booking reduces the bus's `availableSeats` by one.

Existing databases created before this change can be upgraded with
`mysql -u <user> -p < sql/migrations/001_link_bookings_to_users_and_buses.sql`.

## Queries

`npm run queries` runs:

- `User.findAll()` to fetch all users
- `Bus.findAll({ where: { availableSeats: { [Op.gt]: 10 } } })` to fetch buses with more than 10 seats available

## Endpoints

| Method | Path                      | Description                                   |
|--------|---------------------------|-----------------------------------------------|
| POST   | `/users`                  | Add a new user                                |
| GET    | `/users`                  | Retrieve all users                            |
| GET    | `/users/:id`              | Retrieve a user                               |
| PUT    | `/users/:id`              | Update a user                                 |
| DELETE | `/users/:id`              | Delete a user                                 |
| GET    | `/users/:id/bookings`     | A user's bookings with bus details            |
| POST   | `/buses`                  | Add a new bus                                 |
| GET    | `/buses/available/:seats` | Buses with more than `:seats` available seats |
| GET    | `/buses/:id/bookings`     | A bus's bookings with user details            |
| POST   | `/bookings`               | Book a seat (`userId`, `busId`, `seatNumber`) |

Example body for `POST /users`: `{ "name": "Meera Nair", "email": "meera.nair@example.com" }`
Example body for `POST /buses`: `{ "busNumber": "KL-05-KL-2468", "totalSeats": 40, "availableSeats": 12 }`

Import [postman/bus-booking.postman_collection.json](postman/bus-booking.postman_collection.json) into Postman to try them.
Validation errors return `400`, missing users return `404`. SQL run by Sequelize is logged with a `[DB]` prefix.

`npm run demo` (with the server running) creates, updates and deletes a test user.

Raw SQL versions from the earlier phase are in [sql/](sql/).
