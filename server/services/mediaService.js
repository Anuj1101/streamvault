import { v4 as uuidv4 } from 'uuid';
import { validateAndExtractYouTubeId, validateDownloadOptions } from '../validators/urlValidator.js';
import ytDlpProvider from './ytDlpProvider.js';
import mediaProcessor from './mediaProcessor.js';
import tempFileManager from '../utils/tempFileManager.js';
import logger from '../utils/logger.js';

class MediaService {
  constructor() {
    this.jobs = new Map();
    this.startJobCleanupInterval();
  }

  /**
   * Analyze YouTube URL and return available metadata & formats
   */
  async analyze(rawUrl) {
    const { videoId, canonicalUrl } = validateAndExtractYouTubeId(rawUrl);
    const metadata = await ytDlpProvider.getMetadata(canonicalUrl);

    return {
      id: metadata.id,
      title: metadata.title,
      channel: metadata.channel,
      duration: metadata.duration,
      formattedDuration: metadata.formattedDuration,
      thumbnail: metadata.thumbnail,
      canonicalUrl: metadata.webpageUrl,
      qualities: metadata.qualities,
      formats: metadata.formats
    };
  }

  /**
   * Initialize a download / transcoding job
   */
  async startJob({ rawUrl, format, quality }) {
    const { canonicalUrl } = validateAndExtractYouTubeId(rawUrl);
    const validOptions = validateDownloadOptions(format, quality);

    // Fetch metadata to verify requested quality is truly available
    const metadata = await ytDlpProvider.getMetadata(canonicalUrl);

    if (validOptions.format !== 'jpg') {
      const targetQuality = metadata.qualities.find(q => q.key === validOptions.quality);
      if (targetQuality && !targetQuality.available) {
        throw new Error(`The requested quality (${validOptions.quality}) is unavailable for this video.`);
      }
    }

    const jobId = uuidv4();
    const job = {
      id: jobId,
      status: 'preparing',
      percent: 0,
      message: 'Preparing...',
      title: metadata.title,
      format: validOptions.format,
      quality: validOptions.quality,
      result: null,
      error: null,
      createdAt: Date.now()
    };

    this.jobs.set(jobId, job);
    logger.info(`Starting job ${jobId} for "${metadata.title}" [${validOptions.format}, ${validOptions.quality}]`);

    // Launch processing in background
    mediaProcessor.processJob({
      jobId,
      canonicalUrl,
      format: validOptions.format,
      quality: validOptions.quality,
      title: metadata.title,
      onProgress: (progress) => {
        const current = this.jobs.get(jobId);
        if (current) {
          current.status = progress.status;
          current.percent = progress.percent;
          if (progress.message) current.message = progress.message;
          if (progress.error) current.error = progress.error;
        }
      }
    }).then((result) => {
      const current = this.jobs.get(jobId);
      if (current) {
        current.status = 'ready';
        current.percent = 100;
        current.message = 'Download Ready';
        current.result = result;
      }
    }).catch((err) => {
      const current = this.jobs.get(jobId);
      if (current) {
        current.status = 'failed';
        current.error = err.message || 'Processing failed.';
      }
    });

    return {
      jobId,
      status: job.status,
      message: job.message
    };
  }

  /**
   * Retrieve job state
   */
  getJob(jobId) {
    const job = this.jobs.get(jobId);
    if (!job) {
      throw new Error('Download job not found or expired.');
    }
    return {
      id: job.id,
      status: job.status,
      percent: job.percent,
      message: job.message,
      title: job.title,
      format: job.format,
      quality: job.quality,
      error: job.error,
      isReady: job.status === 'ready',
      fileSize: job.result ? job.result.fileSize : null,
      fileName: job.result ? job.result.fileName : null
    };
  }

  /**
   * Get file details for streaming to client
   */
  getJobResult(jobId) {
    const job = this.jobs.get(jobId);
    if (!job || !job.result) {
      throw new Error('Download file is not ready or has expired.');
    }
    return job.result;
  }

  /**
   * Trigger cleanup for a completed or aborted job
   */
  async cleanupJob(jobId) {
    this.jobs.delete(jobId);
    await tempFileManager.removeJobDirectory(jobId);
  }

  startJobCleanupInterval() {
    setInterval(() => {
      const now = Date.now();
      const expirationMs = 20 * 60 * 1000; // 20 minutes
      for (const [jobId, job] of this.jobs.entries()) {
        if (now - job.createdAt > expirationMs) {
          logger.info(`Evicting expired job in-memory record: ${jobId}`);
          this.cleanupJob(jobId);
        }
      }
    }, 5 * 60 * 1000).unref();
  }
}

export const mediaService = new MediaService();
export default mediaService;
