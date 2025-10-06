const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;

// Detectar entorno
const isProd = process.env.NODE_ENV === 'production';
const baseURL = isProd
  ? 'https://week3-i0vy.onrender.com' // tu URL en Render
  : 'http://localhost:8080';          // local

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${baseURL}/api/auth/google/callback`
  },
  (accessToken, refreshToken, profile, done) => {
    // Aquí normalmente buscarías o crearías el usuario en tu DB
    return done(null, profile);
  }
));

// GitHub OAuth Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${baseURL}/api/auth/github/callback`
  },
  (accessToken, refreshToken, profile, done) => {
    // Aquí normalmente buscarías o crearías el usuario en tu DB
    return done(null, profile);
  }
));

// Serializar usuario para sesión
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

module.exports = passport;
