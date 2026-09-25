import fs from 'fs';
import path from 'path';
import config from '../config/index.js';
import logger from './logger.js';

class TempFileManager {
  constructor() {
    this.baseDir = config.tempDir;
    this.ensureBaseDir();
    this.startGarbageCollector();
  }

  ensureBaseDir() {
    try {
      if (!fs.existsSync(this.baseDir)) {
        fs.mkdirSync(this.baseDir, { recursive: true });
        logger.info(`Initialized temp directory at ${this.baseDir}`);
      }
    } catch (err) {
      logger.error('Failed to initialize temp directory:', { error: err.message });
    }
  }

  createJobDirectory(jobId) {
    const jobDir = path.join(this.baseDir, jobId);
    if (!fs.existsSync(jobDir)) {
      fs.mkdirSync(jobDir, { recursive: true });
    }
    return jobDir;
  }

  sanitizeFilename(name, fallback = 'media') {
    if (!name || typeof name !== 'string') return fallback;
    // Replace problematic Windows and Unix filesystem characters
    const sanitized = name
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    return sanitized.length > 0 ? sanitized.substring(0, 100) : fallback;
  }

  async removeJobDirectory(jobId) {
    try {
      const jobDir = path.join(this.baseDir, jobId);
      if (fs.existsSync(jobDir)) {
        await fs.promises.rm(jobDir, { recursive: true, force: true });
        logger.debug(`Removed temp job directory: ${jobId}`);
      }
    } catch (err) {
      logger.warn(`Could not clean up temp directory for job ${jobId}: ${err.message}`);
    }
  }

  async removeFile(filePath) {
    try {
      if (filePath && fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        logger.debug(`Removed temp file: ${filePath}`);
      }
    } catch (err) {
      logger.warn(`Could not delete temp file ${filePath}: ${err.message}`);
    }
  }

  startGarbageCollector() {
    setInterval(async () => {
      try {
        if (!fs.existsSync(this.baseDir)) return;
        const entries = await fs.promises.readdir(this.baseDir, { withFileTypes: true });
        const now = Date.now();

        for (const entry of entries) {
          const entryPath = path.join(this.baseDir, entry.name);
          try {
            const stats = await fs.promises.stat(entryPath);
            const ageMs = now - stats.mtimeMs;
            if (ageMs > config.cleanup.staleAgeMs) {
              if (entry.isDirectory()) {
                await fs.promises.rm(entryPath, { recursive: true, force: true });
                logger.info(`Garbage collected stale directory: ${entry.name}`);
              } else {
                await fs.promises.unlink(entryPath);
                logger.info(`Garbage collected stale file: ${entry.name}`);
              }
            }
          } catch (statErr) {
            // Ignore if file was already removed
          }
        }
      } catch (err) {
        logger.warn(`Garbage collection error: ${err.message}`);
      }
    }, config.cleanup.sweepIntervalMs).unref();
  }
}

export const tempFileManager = new TempFileManager();
export default tempFileManager;
