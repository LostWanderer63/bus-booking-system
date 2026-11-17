USE bus_booking;

SELECT id, name, email FROM Users;

SELECT id, busNumber, totalSeats, availableSeats
FROM Buses
WHERE availableSeats > 10;
