const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js'];

// ✅ Usa tu URL real de Render
const RENDER_URL = 'week3-i0vy.onrender.com';

const doc = {
  info: {
    title: 'W03 CRUD API',
    description: 'API for items and orders CRUD operations',
    version: '1.0.0'
  },
  host: RENDER_URL,
  schemes: ['https']  // ✅ Importante: https para Render
};

console.log('Generating Swagger for:', RENDER_URL);
swaggerAutogen(outputFile, endpointsFiles, doc);