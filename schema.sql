CREATE DATABASE moviePlannerDB;
USE moviePlannerDB;

-- Create the table plans.
CREATE TABLE movies
(
id int NOT NULL AUTO_INCREMENT,
movies varchar(255) NOT NULL,
PRIMARY KEY (id)
);

-- Insert a set of records.
INSERT INTO movies (movies) VALUES ('Rush Hour 1');
