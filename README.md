# Bus Booking System

Initial MySQL schema for a bus booking system where users book seats on buses and pay for their bookings.

## Tables

| Table    | Columns                                   |
|----------|-------------------------------------------|
| Users    | id, name, email                           |
| Buses    | id, busNumber, totalSeats, availableSeats |
| Bookings | id, seatNumber                            |
| Payments | id, amountPaid, paymentStatus             |

Every `id` is an `INT AUTO_INCREMENT PRIMARY KEY`.

## Run

```bash
mysql -u <user> -p < schema.sql
```

## Express API

### Setup

```bash
npm install
cp .env.example .env        # fill in your MySQL credentials
mysql -u <user> -p < schema.sql
npm start                   # http://localhost:3000
```

### Endpoints

Each resource supports `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`.

| Resource | Path        | Body fields                               |
|----------|-------------|-------------------------------------------|
| Users    | `/users`    | name, email                               |
| Buses    | `/buses`    | busNumber, totalSeats, availableSeats     |
| Bookings | `/bookings` | seatNumber                                |
| Payments | `/payments` | amountPaid, paymentStatus                 |

All insert, update and delete operations are logged to the console with a `[DB]` prefix.
Updating or deleting a non-existent id returns `404`; a non-numeric id returns `400`.
The connection pool is reused across requests and closed on `SIGINT`/`SIGTERM`.

Example:

```bash
curl -X POST localhost:3000/users -H 'Content-Type: application/json' \
  -d '{"name":"Asha","email":"asha@example.com"}'
```

### Additional task demo

With the server running, `npm run demo` creates **Virat Kohli** (`virat.kohli@example.com`),
updates it to **King Kohli** (`king.kohli@example.com`), deletes it, then confirms that
GET/PUT/DELETE on the deleted id return `404`.
