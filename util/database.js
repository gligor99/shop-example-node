const { Pool } = require("pg");

const db = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost", // points to postgres-db in docker-compose
  database: process.env.DB_NAME || "shop",
  password: process.env.DB_PASSWORD || "your_password",
  port: process.env.DB_PORT || 5432,
});

module.exports = db;
