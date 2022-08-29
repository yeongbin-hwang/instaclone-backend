require('dotenv').config();

module.exports = {
  development: {
    username: 'root',
    password: process.env.MYSQL_PASSWORD,
    database: 'database_development',
    host: process.env.MYSQL_URL,
    dialect: 'mysql',
  },
  test: {
    username: 'root',
    password: process.env.MYSQL_PASSWORD,
    database: 'database_test',
    host: process.env.MYSQL_URL,
    dialect: 'mysql',
  },
  production: {
    username: 'root',
    password: process.env.MYSQL_PASSWORD,
    database: 'database_production',
    host: process.env.MYSQL_URL,
    dialect: 'mysql',
  },
};
