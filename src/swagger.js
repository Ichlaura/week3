const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js'];

const doc = {
  info: {
    title: 'W03 CRUD API',
    description: 'API for items and orders CRUD operations',
    version: '1.0.0'
  },
  host: `localhost:${process.env.PORT || 8080}`,
  schemes: ['http'],
  tags: [
    {
      name: 'Items',
      description: 'Items CRUD operations'
    },
    {
      name: 'Orders', 
      description: 'Orders CRUD operations'
    }
  ]
};

// Esta es la forma correcta
swaggerAutogen(outputFile, endpointsFiles, doc);