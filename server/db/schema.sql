-- Recommend downloading postgres app

-- In terminal go to the server/db directory and run 'psql < schema.sql'
-- This sets up the schema and tables, then run 'psql' to enter command 
-- \c [database-name] connects to db, look for test
-- \d [table-name] describes table, look for "users"
-- \q quits the shell

DROP TABLE IF EXISTS users CASCADE;


CREATE TABLE users (
  "user_id" serial NOT NULL,
  "username" varchar NOT NULL,
  "github_id" bigint,
  "github_token" varchar,
  CONSTRAINT users_pk PRIMARY KEY ("user_id")
) WITH (
  OIDS=FALSE
);

