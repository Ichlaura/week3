// ⚠️ dotenv primero, antes de cualquier require que use variables de entorno
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('./auth/passport');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');

// Rutas de la API
const itemsRoutes = require('./routes/items');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');

const app = express();

// --- Middlewares base ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Configurar sesión ---
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 14 * 24 * 60 * 60 // 14 días
    }),
    cookie: { 
      maxAge: 1000 * 60 * 60 * 24,
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true
    }
  })
);

// --- Inicializar Passport ---
app.use(passport.initialize());
app.use(passport.session());

// --- Middleware para proteger rutas ---
const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: 'No autorizado, inicia sesión primero' });
};

// --- Swagger UI ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// --- Rutas principales ---
app.use('/api/auth', authRoutes);
app.use('/api/items', ensureAuth, itemsRoutes);
app.use('/api/orders', ensureAuth, ordersRoutes);

// --- Redirecciones útiles ---
app.get('/', (req, res) => res.redirect('/api-docs'));
app.get('/api', (req, res) => res.redirect('/api-docs'));

// --- Health check para Render ---
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: app.locals.db ? 'Connected' : 'Disconnected'
  });
});

// --- Conexión a MongoDB mejorada ---
const connectDB = async () => {
  try {
    const client = new MongoClient(process.env.MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    
    await client.connect();
    app.locals.db = client.db();
    console.log('✅ Connected to MongoDB successfully.');
    
    // Verificar conexión
    await client.db().admin().ping();
    console.log('✅ MongoDB ping successful.');
    
  } catch (err) {
    console.error('❌ Error connecting to MongoDB:', err);
    // No detenemos la aplicación, pero la BD no estará disponible
  }
};

// --- Arranque del servidor ---
const startServer = async () => {
  // Conectar a BD primero
  await connectDB();
  
  const port = process.env.PORT || 8080;
  
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`✅ Servidor corriendo en puerto: ${port}`);
    console.log(`📘 Documentación Swagger disponible en /api-docs`);
    console.log(`❤️  Health check disponible en /health`);
  });

  // Manejo graceful de shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
      console.log('Process terminated');
    });
  });
};

startServer();

module.exports = app;