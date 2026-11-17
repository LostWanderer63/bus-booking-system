
CREATE DATABASE IF NOT EXISTS bus_booking;
USE bus_booking;

CREATE TABLE Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE Buses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  busNumber VARCHAR(50) NOT NULL UNIQUE,
  totalSeats INT NOT NULL,
  availableSeats INT NOT NULL,
  CHECK (totalSeats > 0),
  CHECK (availableSeats >= 0 AND availableSeats <= totalSeats)
);

CREATE TABLE Bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  seatNumber INT NOT NULL,
  CHECK (seatNumber > 0)
);

CREATE TABLE Payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  amountPaid DECIMAL(10, 2) NOT NULL,
  paymentStatus ENUM('pending', 'success', 'failed') NOT NULL DEFAULT 'pending',
  CHECK (amountPaid >= 0)
);
