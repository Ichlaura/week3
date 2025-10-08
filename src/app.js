// ⚠️ dotenv primero, antes de cualquier require que use variables de entorno
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const { MongoClient } = require('mongodb');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('./auth/passport'); // <-- carga las strategies
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

// --- Configurar sesión (persistente en Mongo si hay MONGODB_URI) ---
const sessionStore = process.env.MONGODB_URI
  ? MongoStore.create({ mongoUrl: process.env.MONGODB_URI })
  : null;

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
    store: sessionStore || undefined,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 día
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

// --- Detectar entorno (para Render o local) ---
const isProd = process.env.NODE_ENV === 'production';
const swaggerDocument = { ...swaggerFile };

if (isProd) {
  swaggerDocument.host = 'week3-i0vy.onrender.com';
  swaggerDocument.schemes = ['https'];
} else {
  swaggerDocument.host = 'localhost:8080';
  swaggerDocument.schemes = ['http'];
}

// --- Swagger UI ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- Rutas principales ---
// ⚠️ Autenticación primero (sin protección)
app.use('/api/auth', authRoutes);

// ⚙️ Rutas protegidas
app.use('/api/items', ensureAuth, itemsRoutes);
app.use('/api/orders', ensureAuth, ordersRoutes);

// --- Redirecciones útiles ---
app.get('/', (req, res) => res.redirect('/api-docs'));
app.get('/api', (req, res) => res.redirect('/api-docs'));

// --- Conexión a MongoDB (no bloquea el arranque del servidor) ---
MongoClient.connect(process.env.MONGODB_URI)
  .then(client => {
    const db = client.db();
    app.locals.db = db;
    console.log('✅ Connected to MongoDB successfully.');
  })
  .catch(err => {
    console.error('❌ Error connecting to MongoDB:', err);
  });

// --- Arranque del servidor ---
// ⚠️ Render asigna un puerto automáticamente (process.env.PORT)
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`✅ Servidor corriendo en ${isProd ? 'Render' : 'localhost'}:${port}`);
  console.log(`📘 Documentación Swagger disponible en /api-docs`);
});

module.exports = app;
