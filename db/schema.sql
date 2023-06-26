CREATE DATABASE events_app;
USE events_app;

CREATE TABLE User(
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
)

CREATE TABLE Events(
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    date DATE NOT NULL,
    time TIME NOT NULL,
    address VARCHAR(255) NOT NULL,
    max_participants INTEGER NOT NULL,
    creator INT NOT NULL,
    FOREIGN KEY (creator) REFERENCES User(id)
)

CREATE TABLE Participants(
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL
);