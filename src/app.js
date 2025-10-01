const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');
const itemsRoutes = require('./routes/items');

dotenv.config();

const app = express();
app.use(bodyParser.json());

// Rutas API
app.use('/api/items', itemsRoutes);

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

const port = process.env.PORT || 3000;

// Conectar a MongoDB
MongoClient.connect(process.env.MONGODB_URI)
  .then(client => {
    const db = client.db();
    app.locals.db = db;
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));
