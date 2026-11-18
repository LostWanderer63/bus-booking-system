USE bus_booking;

INSERT IGNORE INTO Users (id, name, email) VALUES
  (1, 'Aarav Sharma', 'aarav.sharma@example.com'),
  (2, 'Priya Patel', 'priya.patel@example.com'),
  (3, 'Rohan Gupta', 'rohan.gupta@example.com'),
  (4, 'Ananya Iyer', 'ananya.iyer@example.com'),
  (5, 'Vikram Singh', 'vikram.singh@example.com');

INSERT IGNORE INTO Buses (id, busNumber, totalSeats, availableSeats) VALUES
  (1, 'KA-01-AB-1234', 40, 32),
  (2, 'MH-12-CD-5678', 50, 8),
  (3, 'DL-03-EF-9012', 35, 15),
  (4, 'TN-09-GH-3456', 45, 3),
  (5, 'TS-07-IJ-7890', 30, 22);

INSERT IGNORE INTO Bookings (id, seatNumber, userId, busId) VALUES
  (1, 12, 1, 1),
  (2, 5, 2, 2),
  (3, 27, 3, 3),
  (4, 3, 4, 4),
  (5, 18, 5, 5);

INSERT IGNORE INTO Payments (id, amountPaid, paymentStatus) VALUES
  (1, 850.00, 'success'),
  (2, 1200.50, 'success'),
  (3, 640.00, 'pending'),
  (4, 990.75, 'failed'),
  (5, 1500.00, 'success');
