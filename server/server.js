import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from './config/index.js';
import logger from './utils/logger.js';
import mediaRoutes from './routes/mediaRoutes.js';
import { globalLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

// Render places the service behind one reverse proxy.
app.set('trust proxy', config.trustProxy);

// Security HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS Configuration
const allowedOrigins = [
  config.frontendUrl,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Dev-friendly permissive fallback
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request body parser with size limit
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Global rate limiting
app.use('/api/', globalLimiter);

// API Routes
app.use('/api/media', mediaRoutes);

// Root route for sanity check
app.get('/', (req, res) => {
  res.json({
    name: 'YouTube Video & Audio Downloader API',
    status: 'online',
    version: '1.0.0'
  });
});

// 404 and Error handling
app.use(notFoundHandler);
app.use(errorHandler);

let server = null;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(config.port, () => {
    logger.info(`Media Downloader Server running on port ${config.port} [${config.nodeEnv}]`);
    logger.info(`Allowed frontend URL: ${config.frontendUrl}`);
    logger.info(`YouTube cookies: ${config.youtubeCookiesPath ? 'configured' : 'not configured'}`);
  });
}

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed.');
    process.exit(0);
  });
});

export default app;
