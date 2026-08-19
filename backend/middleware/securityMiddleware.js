const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

// Global API rate limiter (150 requests per 15 minutes)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many requests from this IP. Please try again after 15 minutes.'
  }
});

// Strict Rate limiter for Login & Register routes (10 attempts per 15 minutes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many authentication attempts. Please try again after 15 minutes.'
  }
});

// Rate limiter for AI prediction endpoint (30 predictions per 15 minutes)
const predictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'AI prediction request limit reached. Please wait a few minutes before trying again.'
  }
});

// NoSQL Query Injection Sanitizer
const sanitizeInput = mongoSanitize({
  replaceWith: '_'
});

// Helmet Security Headers Setup
const configureHelmet = () => {
  return helmet({
    contentSecurityPolicy: false, // Disable CSP blocking for inline scripts/fonts in Vite dev
    crossOriginEmbedderPolicy: false,
    xFrameOptions: { action: 'sameorigin' },
    xContentTypeOptions: true,
    xssFilter: true,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  });
};

module.exports = {
  apiLimiter,
  authLimiter,
  predictLimiter,
  sanitizeInput,
  configureHelmet
};
