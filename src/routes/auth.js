// src/routes/auth.js
const express = require('express');
const passport = require('passport');

const router = express.Router();

// ==========================
// Función para proteger rutas
// ==========================
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: 'Login required' });
}

// ==========================
// Google OAuth
// ==========================
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/api/auth/failure' }),
  (req, res) => {
    res.redirect('/api-docs'); // redirigir a Swagger o página principal
  }
);

// ==========================
// GitHub OAuth
// ==========================
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/api/auth/failure' }),
  (req, res) => {
    res.redirect('/api-docs');
  }
);

// ==========================
// Logout
// ==========================
router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) return next(err);
    res.redirect('/api-docs'); // redirige a la documentación o home
  });
});

// ==========================
// Ruta de prueba protegida
// ==========================
router.get('/protected', ensureAuthenticated, (req, res) => {
  res.json({ message: `Hola ${req.user.displayName || req.user.username}, esta ruta es protegida` });
});

// ==========================
// Ruta para obtener info del usuario logueado
// ==========================
router.get('/me', ensureAuthenticated, (req, res) => {
  res.json({
    user: req.user,
  });
});

// ==========================
// Ruta de fallo de login
// ==========================
router.get('/failure', (req, res) => {
  res.status(401).json({ message: 'Authentication failed' });
});

module.exports = router;
