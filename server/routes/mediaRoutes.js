import express from 'express';
import mediaController from '../controllers/mediaController.js';
import { analyzeLimiter, downloadLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Health check
router.get('/health', (req, res) => mediaController.health(req, res));

// Analyze media URL
router.post('/analyze', analyzeLimiter, (req, res, next) => mediaController.analyze(req, res, next));

// Start download / conversion job
router.post('/download', downloadLimiter, (req, res, next) => mediaController.startDownload(req, res, next));

// Poll job progress
router.get('/progress/:jobId', (req, res, next) => mediaController.getProgress(req, res, next));

// Stream finished media file
router.get('/file/:jobId', (req, res, next) => mediaController.downloadFile(req, res, next));

export default router;
