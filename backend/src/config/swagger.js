const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TZW Fire Extinguisher Management System API',
      version: '1.0.0',
      description: 'RESTful API for managing fire extinguishers, inspections, and maintenance for TZW LTD',
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:5000',
        description: process.env.API_URL ? 'Deployed server' : 'Local development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;