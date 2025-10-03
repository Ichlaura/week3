const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js'];

// URL dinámica para producción
const getHost = () => {
  if (process.env.RENDER_EXTERNAL_URL) {
    return process.env.RENDER_EXTERNAL_URL.replace('https://', '');
  }
  return `localhost:${process.env.PORT || 8080}`;
};

const getSchemes = () => {
  return process.env.RENDER_EXTERNAL_URL ? ['https'] : ['http'];
};

const doc = {
  info: {
    title: 'W03 CRUD API',
    description: 'API for items and orders CRUD operations',
    version: '1.0.0'
  },
  host: getHost(),
  schemes: getSchemes()
};

console.log('Generating Swagger for host:', getHost());
swaggerAutogen(outputFile, endpointsFiles, doc);