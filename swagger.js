
/*const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Portfolio Management API',
      version: '1.0.0',
      description: 'A portfolio management API for tracking stocks',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'access_token',
        },
      },
      schemas: {
        Stock: {
          type: 'object',
          properties: {
            ticker: { type: 'string', example: 'AAPL' },
            amount: { type: 'integer', example: 10 },
            priceBought: { type: 'number', example: 150.25 },
          },
        },
        User: {
          type: 'object',
          properties: {
            firstname: { type: 'string', example: 'John' },
            lastname: { type: 'string', example: 'Doe' },
            username: { type: 'string', example: 'johndoe' },
            password: { type: 'string', example: 'password123' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            error: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./controllers/*.js'], // Path to your controller files
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
}; */
// swagger.js - Fixed version
// swagger.js - Corrected version
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Portfolio Management API',
      version: '1.0.0',
      description: 'A portfolio management API for tracking stocks',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'access_token',
        },
      },
      schemas: {
        Stock: {
          type: 'object',
          properties: {
            ticker: { type: 'string', example: 'AAPL' },
            amount: { type: 'integer', example: 10 },
            priceBought: { type: 'number', example: 150.25 },
          },
        },
        User: {
          type: 'object',
          properties: {
            firstname: { type: 'string', example: 'John' },
            lastname: { type: 'string', example: 'Doe' },
            username: { type: 'string', example: 'johndoe' },
            password: { type: 'string', example: 'password123' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            error: { type: 'string' },
          },
        },
      },
    },
  },
  // Based on your uploaded files, they seem to be in the root directory
  // Only include specific files, not directories
  apis: [
    './controllers.js',  // Your controllers file
    './auth.js'         // Your auth file
  ],
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};