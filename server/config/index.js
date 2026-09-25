import path from 'path';
import os from 'os';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  tempDir: process.env.TEMP_DIRECTORY 
    ? path.resolve(process.env.TEMP_DIRECTORY)
    : path.join(os.tmpdir(), 'yt_downloader_temp'),
  maxFileSizeMB: parseInt(process.env.MAX_FILE_SIZE || '500', 10),
  pythonPath: process.env.PYTHON_PATH || (process.platform === 'win32' ? 'python' : 'python3'),
  rateLimits: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    analyzeMaxRequests: parseInt(process.env.ANALYZE_RATE_LIMIT || '30', 10),
    downloadMaxRequests: parseInt(process.env.DOWNLOAD_RATE_LIMIT || '15', 10),
  },
  cleanup: {
    staleAgeMs: 30 * 60 * 1000, // 30 minutes
    sweepIntervalMs: 10 * 60 * 1000, // 10 minutes
  }
};

export default config;
