const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME || "shop",
  process.env.DB_USER || "postgres",
  process.env.DB_PASSWORD || "your_password",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    port: process.env.DB_PORT || 5432,
  }
);

module.exports = sequelize;
