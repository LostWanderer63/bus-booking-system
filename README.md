# Bus Booking System

Express API for a bus booking system using **Sequelize** (MySQL).

## Setup

```bash
npm install
cp .env.example .env              # add your MySQL credentials
mysql -u <user> -p < schema.sql   # creates the bus_booking database
npm run seed                      # adds 3 users and 2 buses with create()
npm start                         # http://localhost:3000
```

## Models

`src/models/` defines `User`, `Bus`, `Booking` and `Payment` (no associations yet), mapped to the
`Users`, `Buses`, `Bookings` and `Payments` tables.

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
| POST   | `/buses`                  | Add a new bus                                 |
| GET    | `/buses/available/:seats` | Buses with more than `:seats` available seats |

Example body for `POST /users`: `{ "name": "Meera Nair", "email": "meera.nair@example.com" }`
Example body for `POST /buses`: `{ "busNumber": "KL-05-KL-2468", "totalSeats": 40, "availableSeats": 12 }`

Import [postman/bus-booking.postman_collection.json](postman/bus-booking.postman_collection.json) into Postman to try them.
Validation errors return `400`, missing users return `404`. SQL run by Sequelize is logged with a `[DB]` prefix.

`npm run demo` (with the server running) creates, updates and deletes a test user.

Raw SQL versions from the earlier phase are in [sql/](sql/).
