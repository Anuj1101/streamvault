import rateLimit from 'express-rate-limit';
import config from '../config/index.js';

export const globalLimiter = rateLimit({
  windowMs: config.rateLimits.windowMs,
  max: config.rateLimits.maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});

export const analyzeLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: config.rateLimits.analyzeMaxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Analysis rate limit reached. Please wait a few minutes before analyzing more media.'
  }
});

export const downloadLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: config.rateLimits.downloadMaxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Download request limit reached. Please wait a few minutes before starting more downloads.'
  }
});
