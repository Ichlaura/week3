const swaggerAutogen = require('swagger-autogen')();

const outputFile = './src/swagger-output.json';
const endpointsFiles = ['./src/routes/items.js'];

swaggerAutogen(outputFile, endpointsFiles, {
  info: {
    title: 'W03 CRUD API',
    description: 'API for items CRUD operations'
  },
  host: `localhost:${process.env.PORT || 8080}`,
  schemes: ['http']
});
