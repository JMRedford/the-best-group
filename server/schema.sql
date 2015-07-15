CREATE SCHEMA test;

CREATE TABLE "Users" (
  "user_id" serial NOT NULL,
  "username" char NOT NULL,
  CONSTRAINT Users_pk PRIMARY KEY ("user_id")
) WITH (
  OIDS=FALSE
);

