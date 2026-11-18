USE bus_booking;

ALTER TABLE Bookings
  ADD COLUMN userId INT NULL,
  ADD COLUMN busId INT NULL;

UPDATE Bookings SET userId = id, busId = id WHERE userId IS NULL;

ALTER TABLE Bookings
  MODIFY userId INT NOT NULL,
  MODIFY busId INT NOT NULL,
  ADD CONSTRAINT fk_bookings_user FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_bookings_bus FOREIGN KEY (busId) REFERENCES Buses(id) ON DELETE CASCADE,
  ADD CONSTRAINT uq_bus_seat UNIQUE (busId, seatNumber);
