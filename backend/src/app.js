/**
 * Express app setup
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const compression = require('compression');
const { env } = require('./config');
const { globalErrorHandler } = require('./middleware');

// Create Express app
const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Request parsing and optimization
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(compression());

// Logging
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// API Routes prefix
const API_PREFIX = env.API_PREFIX;

// Import routes
const assessmentRoutes = require('./routes/assessmentRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const authRoutes = require('./routes/authRoutes');
const adaptiveAssessmentRoutes = require('./routes/adaptiveAssessmentRoutes');

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

// Register routes
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/assessments`, assessmentRoutes);
app.use(`${API_PREFIX}/candidates`, candidateRoutes);
app.use(`${API_PREFIX}/adaptive-assessments`, adaptiveAssessmentRoutes);

// Global error handler
app.use(globalErrorHandler);

module.exports = app;