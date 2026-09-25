import fs from 'fs';
import mediaService from '../services/mediaService.js';
import logger from '../utils/logger.js';

export class MediaController {
  /**
   * POST /api/media/analyze
   */
  async analyze(req, res, next) {
    try {
      const { url } = req.body;
      if (!url) {
        return res.status(400).json({ success: false, error: 'URL is required.' });
      }

      const media = await mediaService.analyze(url);
      res.json({
        success: true,
        media
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/media/download
   * Initiates media preparation job
   */
  async startDownload(req, res, next) {
    try {
      const { url, format, quality } = req.body;
      if (!url) {
        return res.status(400).json({ success: false, error: 'URL is required.' });
      }

      const job = await mediaService.startJob({
        rawUrl: url,
        format: format || 'mp4',
        quality: quality || 'original'
      });

      res.status(202).json({
        success: true,
        jobId: job.jobId,
        status: job.status,
        message: job.message
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/media/progress/:jobId
   * Polling endpoint for real-time progress
   */
  async getProgress(req, res, next) {
    try {
      const { jobId } = req.params;
      const job = mediaService.getJob(jobId);

      res.json({
        success: true,
        job
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/media/file/:jobId
   * Streams the processed media file as attachment
   */
  async downloadFile(req, res, next) {
    try {
      const { jobId } = req.params;
      const result = mediaService.getJobResult(jobId);

      if (!fs.existsSync(result.filePath)) {
        return res.status(404).json({
          success: false,
          error: 'Processed media file not found or has been purged.'
        });
      }

      const safeAsciiName = result.fileName.replace(/[^\x20-\x7E]/g, '_');
      const encodedName = encodeURIComponent(result.fileName);

      res.setHeader('Content-Type', result.mimeType || 'application/octet-stream');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${safeAsciiName}"; filename*=UTF-8''${encodedName}`
      );
      if (result.fileSize) {
        res.setHeader('Content-Length', result.fileSize);
      }

      logger.info(`Streaming file for job ${jobId}: ${result.fileName}`);

      const fileStream = fs.createReadStream(result.filePath);

      fileStream.pipe(res);

      let cleanedUp = false;
      const cleanOnce = () => {
        if (!cleanedUp) {
          cleanedUp = true;
          // Clean up temporary files 10 seconds after stream completion
          setTimeout(() => {
            mediaService.cleanupJob(jobId).catch((err) => {
              logger.warn(`Post-download cleanup failed for ${jobId}: ${err.message}`);
            });
          }, 10000);
        }
      };

      res.on('finish', cleanOnce);
      res.on('close', cleanOnce);

      fileStream.on('error', (err) => {
        logger.error(`Stream error during file transmission for job ${jobId}:`, { error: err.message });
        if (!res.headersSent) {
          res.status(500).json({ success: false, error: 'Failed to stream media file.' });
        }
        cleanOnce();
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/health
   */
  health(req, res) {
    res.json({
      status: 'ok',
      service: 'media-downloader-api',
      timestamp: new Date().toISOString()
    });
  }
}

export const mediaController = new MediaController();
export default mediaController;
