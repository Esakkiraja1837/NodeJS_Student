const path = require('path');
const winston = require('winston');
const errorLogFile = path.join(__dirname, '../../logs/', 'error.log');
const appLogFile = path.join(__dirname, '../../logs/', 'application.log');

const config = {
  levels: {
    error: 0,
    debug: 1,
    warn: 2,
    data: 3,
    info: 4,
    verbose: 5,
    silly: 6,
    custom: 7
  },
  colors: {
    error: 'red',
    debug: 'blue',
    warn: 'yellow',
    data: 'grey',
    info: 'green',
    verbose: 'cyan',
    silly: 'magenta',
    custom: 'yellow'
  }
};

winston.addColors(config.colors);

const { combine, timestamp, printf, colorize, prettyPrint } = winston.format;

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'debug',
  transports: [
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({
          format: 'YYYY-MM-DD hh:mm:ss.SSS A'
        }),
        prettyPrint(),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
      )
    }),
    new winston.transports.File({
      level: 'info',
      filename: appLogFile,
      format: combine(
        timestamp({
          format: 'YYYY-MM-DD hh:mm:ss.SSS A'
        }),
        prettyPrint(),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
      ),
      maxsize: 2097152
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({
      level: 'error',
      filename: errorLogFile,
      format: combine(
        timestamp({
          format: 'YYYY-MM-DD hh:mm:ss.SSS A'
        }),
        prettyPrint(),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
      ),
      maxsize: 2097152
    })
  ]
});

module.exports = logger;
