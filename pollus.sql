--pollus.sql - creates postgres db for pollus app

--db
DROP DATABASE IF EXISTS pollus;
CREATE DATABASE pollus;
\c pollus;
CREATE EXTENSION pgcrypto;

--user table
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    user_id SERIAL NOT NULL,
    username TEXT NOT NULL DEFAULT '',   
    password TEXT NOT NULL DEFAULT '',
    firstName TEXT NOT NULL DEFAULT '',
    lastName TEXT NOT NULL DEFAULT '',
    dob DATE NOT NULL DEFAULT current_date,
    city TEXT NOT NULL DEFAULT '',
    state TEXT NOT NULL DEFAULT '',
    ZIP TEXT NOT NULL DEFAULT '',
    party_affiliation TEXT NOT NULL DEFAULT '',
    income INTEGER NOT NULL DEFAULT 0,
    education_level INT NOT NULL,
    PRIMARY KEY (user_id)
);

--party table
DROP TABLE IF EXISTS parties;
CREATE TABLE parties (
  party_id SERIAL NOT NULL,
  party_name TEXT NOT NULL DEFAULT '',
  year_founded INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (party_id)
);

-- election table
DROP TABLE IF EXISTS elections;
CREATE TABLE elections (
  election_id SERIAL NOT NULL,
  office TEXT NOT NULL DEFAULT '',
  election_date date NOT NULL DEFAULT current_date,
  PRIMARY KEY (election_id)   
);
--candidate table

-- vote table
DROP TABLE IF EXISTS votes;
CREATE TABLE votes (
  vote_id SERIAL NOT NULL,
  user_id INTEGER NOT NULL, --ADD REFERENCE HERE
  PRIMARY KEY (vote_id)
);

--db user
CREATE USER pollster WITH PASSWORD 'changeme';
GRANT ALL PRIVILEGES ON pollus TO pollster;
