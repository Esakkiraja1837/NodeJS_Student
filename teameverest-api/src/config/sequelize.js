const Sequelize = require('sequelize');
const logger = require('./logger');

const sequelize = new Sequelize(
  process.env.DATABASE_NAME, // DATABASE_NAME
  process.env.DATABASE_USERNAME, // DATABASE_USERNAME
  process.env.DATABASE_PASSWORD, // DATABASE_PASSWORD
  {
    host: process.env.DATABASE_HOST_NAME, // DATABASE_HOST_NAME
    dialect: 'mysql'
  },
  { query: { raw: true } }
);

// `authenticate()` method is used to connect with the database and tests whether the given credentials are correct.
try {
  sequelize.authenticate().then(async () => {
    logger.info('Database connection has been established successfully');
  }).catch(error => {
    logger.error('Unable to connect to the database: ', error);
  });
} catch (error) {
  logger.error('Error while establishing DB connectivity. Error: ', error);
}

module.exports = sequelize;
