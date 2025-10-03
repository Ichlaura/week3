const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');

const itemsRoutes = require('./routes/items');
const ordersRoutes = require('./routes/orders');

dotenv.config();

const app = express();
app.use(bodyParser.json());

// ✅ Health check route (AGREGA ESTO)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Rutas API
app.use('/api/items', itemsRoutes);
app.use('/api/orders', ordersRoutes);

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Redirigir la raíz al Swagger UI
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

const port = process.env.PORT || 8080;

// Conectar a MongoDB
MongoClient.connect(process.env.MONGODB_URI)
  .then(client => {
    const db = client.db();
    app.locals.db = db;
    // ✅ Agrega '0.0.0.0' aquí (ESTO FALTA)
    app.listen(port, '0.0.0.0', () => console.log(`Server running on port ${port}`));
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));