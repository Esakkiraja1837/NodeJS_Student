require('dotenv').config();
const cors = require('cors');
const express = require('express');

const routes = require('./routes');
const logger = require('./config/logger');
const { validateToken } = require('./middlewares/token-verifier');

const app = express();
const router = express.Router();
const port = parseInt(process.env.APP_PORT, 10) || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Enabling CORS to all origin
app.use(cors());
// Middleware
app.use(validateToken);
// add router in the Express app.
app.use('/', routes(router));

if (process.env.NODE_ENV === 'development') {
  const swaggerJsdoc = require('swagger-jsdoc');
  const swaggerUi = require('swagger-ui-express');
  // Swagger configuration
  const options = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'Team Everest API Documentation',
        description: 'API documentation using Swagger'
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            in: 'header',
            name: 'Authorization',
            description: 'Bearer token to access api endpoints',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      },
      security: [
        {
          bearerAuth: []
        }
      ]
    },
    apis: ['./src/controllers/*.js']
  };
  const swaggerSpec = swaggerJsdoc(options);
  // Serve Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// Start the server
app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});

module.exports = app;
