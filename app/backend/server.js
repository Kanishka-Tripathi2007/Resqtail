try {
  require('dotenv').config();
} catch (e) {
  // dotenv is optional in some environments — continue if not installed
  console.warn('dotenv not available, skipping .env load');
}
const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const connectDB = require("./config/db");

const app = express();

// Basic security headers — allow inline scripts/styles since frontend uses them extensively
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://checkout.razorpay.com", "https://unpkg.com"],
      scriptSrcAttr: ["'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://unpkg.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "blob:", "https:"],
      connectSrc: ["'self'", "https://overpass-api.de", "https://overpass.kumi.systems", "https://overpass.private.coffee", "https://overpass.openstreetmap.ru", "https://nominatim.openstreetmap.org", "https://api.openai.com", "https://checkout.razorpay.com", "https://*.razorpay.com"],
      frameSrc: ["'self'", "https://api.razorpay.com"],
    }
  }
}));

// CORS configuration (optional ALLOWED_ORIGINS env var, comma-separated)
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
if (allowedOrigins.length) {
  app.use(cors({
    origin: function (origin, cb) {
      if (!origin) return cb(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) return cb(null, true);
      return cb(new Error('CORS not allowed by server'));
    }
  }));
} else {
  app.use(cors());
}

// Body parsing limits; preserve raw body buffer for webhook signature verification
app.use(express.json({ limit: '10kb', verify: (req, res, buf) => { req.rawBody = buf; } }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization against NoSQL injection and XSS
app.use(mongoSanitize());
app.use(xss());

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX) || 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', apiLimiter);

// Stricter limiter for chat endpoint
const chatLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_CHAT_WINDOW_MS) || 60 * 1000,
  max: Number(process.env.RATE_LIMIT_CHAT_MAX) || 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many chat requests, slow down.'
});
app.use('/api/chat', chatLimiter);

connectDB();

app.use("/api/reports", require("./routes/reportRoutes"));
app.use("/api/tracker", require("./routes/trackerRoutes"));
app.use("/api/nearby", require("./routes/nearbyRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/donations", require("./routes/donationRoutes"));
app.use("/api/listings", require("./routes/listingRoutes"));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
  if (
    req.path === '/' ||
    req.path.endsWith('.html') ||
    req.path.endsWith('.js') ||
    req.path.endsWith('.css')
  ) {
    res.setHeader('Cache-Control', 'no-store');
  }
  next();
});

app.use(express.static(path.join(__dirname, "../frontend")));

app.listen(process.env.PORT || 5000, () => {
  console.log("🚀 Server running on port", process.env.PORT || 5000);
});
