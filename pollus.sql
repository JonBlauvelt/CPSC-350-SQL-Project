--pollus.sql - creates postgres db for pollus app

--db
DROP DATABASE IF EXISTS pollus;
CREATE DATABASE pollus;
\c pollus;

--user table
CREATE TABLE user(
    user_id SERIAL NOT NULL,
    firstName TEXT NOT NULL DEFAULT '',
    lastName TEXT NOT NULL DEFAULT '',
    dob DATE NOT NULL DEFAULT '',
    city TEXT NOT NULL DEFAULT '',
    state TEXT NOT NULL DEFAULT '',
    ZIP TEXT NOT NULL DEFAULT '',
    party_affiliation TEXT NOT NULL '';
    income INT NOT NULL '';
    