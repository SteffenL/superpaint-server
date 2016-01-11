# SuperPaint Server

This is the server application containing services meant to be consumed by the SuperPaint client application.

## Runtime environment
- Node.js 5.3.0
- C/C++ compiler (tested Visual C++ 2015 and Clang 3.7)
- Python 2.7
- PostgreSQL 9.4
- Heroku

## Running the server locally

The environment will be "development" by default, and use SQLite instead of PostgreSQL.

1. Install dependencies:
    - `npm install`
    - `npm install knex -g`
2. Run database migration:
    - `knex migrate:latest --knexfile ./src/data/knexfile.js`
3. Run the server with `npm start`.

## Deploy to Heroku

Required add-ons:

- Cloudinary
- Heroku Postgres :: Database

Required environment variables:

- CLOUDINARY_URL: Provided by Heroku.
- DATABASE_URL: Provided by Heroku.
- NODE_ENV: `staging` or `production`.
- SUPERPAINT_DB_CLIENT: `pg`.

Push the latest changes to Heroku, then run database migration:

`heroku run knex migrate:latest --knexfile ./src/data/knexfile.js`
