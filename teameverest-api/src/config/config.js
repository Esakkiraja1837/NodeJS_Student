const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const env = process.env;
module.exports = {
  development: {
    username: env.DATABASE_USERNAME,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME,
    host: env.DATABASE_HOST_NAME,
    dialect: 'mysql'
  },
  test: {
    username: env.DATABASE_USERNAME,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME,
    host: env.DATABASE_HOST_NAME,
    dialect: 'mysql'
  },
  production: {
    username: env.DATABASE_USERNAME,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME,
    host: env.DATABASE_HOST_NAME,
    dialect: 'mysql'
  }
};
