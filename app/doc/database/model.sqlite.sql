-- Creator:       MySQL Workbench 6.3.5/ExportSQLite Plugin 0.1.0
-- Author:        Steffen
-- Caption:       New Model
-- Project:       Name of the project
-- Changed:       2015-11-18 04:10
-- Created:       2015-11-18 03:23
PRAGMA foreign_keys = OFF;

-- Schema: superpaint
ATTACH "superpaint.sdb" AS "superpaint";
BEGIN;
CREATE TABLE "superpaint"."drawing"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "contents" BLOB NOT NULL,-- The contents of the drawing.
  "hash" VARBINARY(64) NOT NULL,-- A hash (up to 512 bits) of the contents of the drawing.
  "hash_hex" VARCHAR(128) NOT NULL,-- A copy of the hash (up to 512 bits) of the contents of the drawing, represented as hexadecimals.
  CONSTRAINT "hash_UNIQUE"
    UNIQUE("hash"),
  CONSTRAINT "hash_string_UNIQUE"
    UNIQUE("hash_hex")
);
COMMIT;
