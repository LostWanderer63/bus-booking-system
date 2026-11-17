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
