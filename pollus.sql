--pollus.sql - creates postgres db for pollus app

--db
DROP DATABASE IF EXISTS pollus;
DROP ROLE IF EXISTS pollster;
CREATE DATABASE pollus;

\c pollus;
CREATE EXTENSION pgcrypto;

--user table
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    user_id SERIAL NOT NULL,
    username TEXT NOT NULL DEFAULT '',   
    password TEXT NOT NULL DEFAULT '',
    dob DATE NOT NULL DEFAULT current_date,
    city TEXT NOT NULL DEFAULT '',
    state TEXT NOT NULL DEFAULT '',
    ZIP TEXT NOT NULL DEFAULT '',
    party_affiliation TEXT NOT NULL DEFAULT '',
    income INTEGER NOT NULL DEFAULT 0,
    education_level INT NOT NULL DEFAULT 0,
    PRIMARY KEY (user_id)
);

--party table
DROP TABLE IF EXISTS parties;
CREATE TABLE parties (
  party_id SERIAL NOT NULL,
  party_name TEXT NOT NULL DEFAULT '',
  year_founded TEXT NOT NULL DEFAULT '',
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
--to do?

-- vote table
DROP TABLE IF EXISTS votes;
CREATE TABLE votes (
  vote_id SERIAL NOT NULL,
  user_id INTEGER NOT NULL, --ADD REFERENCE HERE
  PRIMARY KEY (vote_id)
);

-- states table (not strictly necessary)
DROP TABLE IF EXISTS states;
CREATE TABLE states(
  state_id SERIAL NOT NULL,
  state_abbrev CHAR(2) NOT NULL,
  PRIMARY KEY (state_id)
);

-- education levels
DROP TABLE IF EXISTS ed_levels;
CREATE TABLE ed_levels(
  ed_level_id SERIAL NOT NULL,
  ed_level text NOT NULL,
  PRIMARY KEY (ed_level_id)
);


-- state table entries
INSERT INTO states (state_abbrev) VALUES ('AL');
INSERT INTO states (state_abbrev) VALUES ('AK');
INSERT INTO states (state_abbrev) VALUES ('AS');
INSERT INTO states (state_abbrev) VALUES ('AZ');
INSERT INTO states (state_abbrev) VALUES ('AR');
INSERT INTO states (state_abbrev) VALUES ('CA');
INSERT INTO states (state_abbrev) VALUES ('CO');
INSERT INTO states (state_abbrev) VALUES ('CT');
INSERT INTO states (state_abbrev) VALUES ('DE');
INSERT INTO states (state_abbrev) VALUES ('DC');
INSERT INTO states (state_abbrev) VALUES ('FL');
INSERT INTO states (state_abbrev) VALUES ('FL');
INSERT INTO states (state_abbrev) VALUES ('GA');
INSERT INTO states (state_abbrev) VALUES ('HI');
INSERT INTO states (state_abbrev) VALUES ('ID');
INSERT INTO states (state_abbrev) VALUES ('IL');
INSERT INTO states (state_abbrev) VALUES ('IN');
INSERT INTO states (state_abbrev) VALUES ('IA');
INSERT INTO states (state_abbrev) VALUES ('KS');
INSERT INTO states (state_abbrev) VALUES ('KY');
INSERT INTO states (state_abbrev) VALUES ('LA');
INSERT INTO states (state_abbrev) VALUES ('ME');
INSERT INTO states (state_abbrev) VALUES ('MD');
INSERT INTO states (state_abbrev) VALUES ('MA');
INSERT INTO states (state_abbrev) VALUES ('MI');
INSERT INTO states (state_abbrev) VALUES ('MN');
INSERT INTO states (state_abbrev) VALUES ('MS');
INSERT INTO states (state_abbrev) VALUES ('MO');
INSERT INTO states (state_abbrev) VALUES ('MT');
INSERT INTO states (state_abbrev) VALUES ('NE');
INSERT INTO states (state_abbrev) VALUES ('NV');
INSERT INTO states (state_abbrev) VALUES ('NH');
INSERT INTO states (state_abbrev) VALUES ('NJ');
INSERT INTO states (state_abbrev) VALUES ('NM');
INSERT INTO states (state_abbrev) VALUES ('NY');
INSERT INTO states (state_abbrev) VALUES ('NC');
INSERT INTO states (state_abbrev) VALUES ('ND');
INSERT INTO states (state_abbrev) VALUES ('OH');
INSERT INTO states (state_abbrev) VALUES ('OK');
INSERT INTO states (state_abbrev) VALUES ('OR');
INSERT INTO states (state_abbrev) VALUES ('PA');
INSERT INTO states (state_abbrev) VALUES ('RI');
INSERT INTO states (state_abbrev) VALUES ('SC');
INSERT INTO states (state_abbrev) VALUES ('SD');
INSERT INTO states (state_abbrev) VALUES ('TN');
INSERT INTO states (state_abbrev) VALUES ('TX');
INSERT INTO states (state_abbrev) VALUES ('UT');
INSERT INTO states (state_abbrev) VALUES ('VT');
INSERT INTO states (state_abbrev) VALUES ('VA');
INSERT INTO states (state_abbrev) VALUES ('WA');
INSERT INTO states (state_abbrev) VALUES ('WV');
INSERT INTO states (state_abbrev) VALUES ('WI');
INSERT INTO states (state_abbrev) VALUES ('WY');


--party table entries
INSERT INTO parties (party_name, year_founded) VALUES ('Independent','no affiliation');
INSERT INTO parties (party_name, year_founded) VALUES ('Democratic Party', '1828');
INSERT INTO parties (party_name, year_founded) VALUES ('Republican Party', '1854');
INSERT INTO parties (party_name, year_founded) VALUES ('Libertarian Party', '1971');
INSERT INTO parties (party_name, year_founded) VALUES ('Green Party', '1991');
INSERT INTO parties (party_name, year_founded) VALUES ('Constitution Party', '1992');
INSERT INTO parties (party_name, year_founded) VALUES ('America First Party', '2002');
INSERT INTO parties (party_name, year_founded) VALUES ('American Conservative Party', '2008');
INSERT INTO parties (party_name, year_founded) VALUES ('American Conservative Party', '2008');
INSERT INTO parties (party_name, year_founded) VALUES ('American Freedom Party',  '2010');
INSERT INTO parties (party_name, year_founded) VALUES ('America''s Party',  '2008');
INSERT INTO parties (party_name, year_founded) VALUES ('Birthday Party', '1985');
INSERT INTO parties (party_name, year_founded) VALUES ('Black Riders Liberation Party', '1996');
INSERT INTO parties (party_name, year_founded) VALUES ('Christian Liberty Party', '1996');
INSERT INTO parties (party_name, year_founded) VALUES ('Citizens Party of the United States','2004');
INSERT INTO parties (party_name, year_founded) VALUES ('Communist Party USA','1919');
INSERT INTO parties (party_name, year_founded) VALUES ('Freedom Socialist Party','1966');
INSERT INTO parties (party_name, year_founded) VALUES ('Independent American Party','1998');
INSERT INTO parties (party_name, year_founded) VALUES ('Justice Party','2011');
INSERT INTO parties (party_name, year_founded) VALUES ('Modern Whig Party','2007');
INSERT INTO parties (party_name, year_founded) VALUES ('National Socialist Movement','1974');
INSERT INTO parties (party_name, year_founded) VALUES ('New Black Panther Party','1989');
INSERT INTO parties (party_name, year_founded) VALUES ('Objectivist Party','2008');
INSERT INTO parties (party_name, year_founded) VALUES ('Party for Socialism and Liberation','2004');
INSERT INTO parties (party_name, year_founded) VALUES ('Peace and Freedom Party','1967');
INSERT INTO parties (party_name, year_founded) VALUES ('Prohibition Party','1869');
INSERT INTO parties (party_name, year_founded) VALUES ('Reform Party of the United States of America','1995');
INSERT INTO parties (party_name, year_founded) VALUES ('Socialist Action','1983');
INSERT INTO parties (party_name, year_founded) VALUES ('Socialist Alternative','1986');
INSERT INTO parties (party_name, year_founded) VALUES ('Socialist Equality Party','1966');
INSERT INTO parties (party_name, year_founded) VALUES ('Socialist Party USA','1973');
INSERT INTO parties (party_name, year_founded) VALUES ('Socialist Workers Party','1938');
INSERT INTO parties (party_name, year_founded) VALUES ('Transhumanist Party','2014');
INSERT INTO parties (party_name, year_founded) VALUES ('United States Marijuana Party','2002');
INSERT INTO parties (party_name, year_founded) VALUES ('United States Pacifist Party','1983');
INSERT INTO parties (party_name, year_founded) VALUES ('United States Pirate Party','2006');
INSERT INTO parties (party_name, year_founded) VALUES ('Unity Party of America', '2004');
INSERT INTO parties (party_name, year_founded) VALUES ('Veterans Party of America', '2013');
INSERT INTO parties (party_name, year_founded) VALUES ('Workers World Party', '1959');

--education level inserts
INSERT INTO ed_levels (ed_level) VALUES ('No Degree');
INSERT INTO ed_levels (ed_level) VALUES ('High School Diploma / GED');
INSERT INTO ed_levels (ed_level) VALUES ('Some Colege (No Degree)');
INSERT INTO ed_levels (ed_level) VALUES ('Associate''s or Technical Degree');
INSERT INTO ed_levels (ed_level) VALUES ('Bachelor''s Degree');
INSERT INTO ed_levels (ed_level) VALUES ('Advanced Degree(s)');

--db user
CREATE USER pollster WITH PASSWORD 'hucklebucklebeanstalk123!!';
GRANT ALL PRIVILEGES ON users TO pollster;
GRANT ALL PRIVILEGES ON states TO pollster;
GRANT ALL PRIVILEGES ON parties TO pollster;
GRANT ALL PRIVILEGES ON SEQUENCE users_user_id_seq TO pollster;
GRANT ALL PRIVILEGES ON SEQUENCE states_state_id_seq TO pollster;
GRANT ALL PRIVILEGES ON SEQUENCE parties_party_id_seq TO pollster;
