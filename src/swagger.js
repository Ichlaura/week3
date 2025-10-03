const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js'];

// Configuración dinámica para local y producción
const isProduction = process.env.NODE_ENV === 'production';
const renderUrl = process.env.RENDER_URL; // Agrega esta variable en Render

const doc = {
  info: {
    title: 'W03 CRUD API',
    description: 'API for items and orders CRUD operations',
    version: '1.0.0'
  },
  host: isProduction ? renderUrl : `localhost:${process.env.PORT || 8080}`,
  schemes: isProduction ? ['https'] : ['http']
};

swaggerAutogen(outputFile, endpointsFiles, doc);