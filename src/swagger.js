const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js'];

const doc = {
  info: {
    title: 'W03 CRUD API',
    description: 'API for items and orders CRUD operations with authentication',
    version: '1.0.0'
  },
  host: process.env.NODE_ENV === 'production' 
    ? 'week3-i0vy.onrender.com' 
    : 'localhost:8080',
  schemes: process.env.NODE_ENV === 'production' ? ['https'] : ['http'],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      scheme: 'bearer',
      in: 'header'
    }
  }
};

swaggerAutogen(outputFile, endpointsFiles, doc);