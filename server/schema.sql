-- In terminal run 'psql' if installed and running

-- \c database-name connects to db
-- \d table-name describes table
-- \q quits the shell

DROP TABLE IF EXISTS users CASCADE;


CREATE SCHEMA test;

CREATE TABLE "users" (
  "user_id" serial NOT NULL,
  "username" varchar NOT NULL,
  "github_id" bigint,
  "github_token" varchar,
  CONSTRAINT Users_pk PRIMARY KEY ("user_id")
) WITH (
  OIDS=FALSE
);

