import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import https from 'https';
import http from 'http';
import config from '../config/index.js';
import logger from '../utils/logger.js';
import tempFileManager from '../utils/tempFileManager.js';
import withYouTubeCookies from '../utils/ytDlpArgs.js';

export class MediaProcessor {
  /**
   * Process and prepare media for a given job
   */
  async processJob({ jobId, canonicalUrl, format, quality, title, onProgress }) {
    const jobDir = tempFileManager.createJobDirectory(jobId);
    const sanitizedTitle = tempFileManager.sanitizeFilename(title, 'youtube_media');

    try {
      onProgress({ status: 'preparing', percent: 10, message: 'Preparing request...' });

      if (format === 'jpg') {
        return await this.processThumbnail({ jobId, jobDir, canonicalUrl, sanitizedTitle, onProgress });
      }

      if (format === 'mp3' || format === 'wav') {
        return await this.processAudio({ jobId, jobDir, canonicalUrl, format, sanitizedTitle, onProgress });
      }

      if (format === 'mp4' || format === 'webm') {
        return await this.processVideo({ jobId, jobDir, canonicalUrl, format, quality, sanitizedTitle, onProgress });
      }

      throw new Error(`Unsupported output format: ${format}`);
    } catch (err) {
      logger.error(`Job ${jobId} failed: ${err.message}`);
      onProgress({ status: 'failed', percent: 0, error: err.message });
      throw err;
    }
  }

  /**
   * Download and prepare thumbnail as JPG
   */
  async processThumbnail({ jobId, jobDir, canonicalUrl, sanitizedTitle, onProgress }) {
    onProgress({ status: 'processing', percent: 30, message: 'Fetching highest quality thumbnail...' });

    // Use yt-dlp to write thumbnail into jobDir
    const outputTemplate = path.join(jobDir, `${sanitizedTitle}.%(ext)s`);
    const args = withYouTubeCookies([
      '-m',
      'yt_dlp',
      '--write-thumbnail',
      '--skip-download',
      '--convert-thumbnails',
      'jpg',
      '--no-playlist',
      '-o',
      outputTemplate,
      canonicalUrl
    ]);

    await this.runProcess(config.pythonPath, args, jobDir, (percent, msg) => {
      onProgress({ status: 'processing', percent: Math.max(30, Math.min(85, percent)), message: msg });
    });

    // Locate the saved JPG file
    const files = await fs.promises.readdir(jobDir);
    const jpgFile = files.find(f => f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.webp') || f.endsWith('.png'));

    if (!jpgFile) {
      throw new Error('Failed to generate thumbnail image.');
    }

    const finalPath = path.join(jobDir, jpgFile);
    const stats = await fs.promises.stat(finalPath);

    onProgress({ status: 'ready', percent: 100, message: 'Thumbnail ready for download' });

    return {
      filePath: finalPath,
      fileName: `${sanitizedTitle}.jpg`,
      mimeType: 'image/jpeg',
      fileSize: stats.size
    };
  }

  /**
   * Extract and transcode audio to MP3 or WAV using FFmpeg
   */
  async processAudio({ jobId, jobDir, canonicalUrl, format, sanitizedTitle, onProgress }) {
    const outputFilename = `${sanitizedTitle}.${format}`;
    const outputTemplate = path.join(jobDir, `${sanitizedTitle}.%(ext)s`);

    const args = withYouTubeCookies([
      '-m',
      'yt_dlp',
      '-x',
      '--audio-format',
      format,
      '--newline',
      '--no-playlist',
      '-o',
      outputTemplate
    ]);

    if (format === 'mp3') {
      args.push('--audio-quality', '320K');
    }

    args.push(canonicalUrl);

    onProgress({ status: 'processing', percent: 20, message: 'Extracting source audio stream...' });

    await this.runProcess(config.pythonPath, args, jobDir, (percent, msg) => {
      // Map yt-dlp percent (0-100) to processing percent (20-95%)
      const normalizedPercent = Math.round(20 + (percent * 0.75));
      onProgress({ status: 'processing', percent: normalizedPercent, message: msg });
    });

    const files = await fs.promises.readdir(jobDir);
    const audioFile = files.find(f => f.endsWith(`.${format}`));

    if (!audioFile) {
      throw new Error(`Failed to produce ${format.toUpperCase()} audio file.`);
    }

    const finalPath = path.join(jobDir, audioFile);
    const stats = await fs.promises.stat(finalPath);

    onProgress({ status: 'ready', percent: 100, message: 'Audio ready for download' });

    return {
      filePath: finalPath,
      fileName: outputFilename,
      mimeType: format === 'mp3' ? 'audio/mpeg' : 'audio/wav',
      fileSize: stats.size
    };
  }

  /**
   * Download and remux video to MP4 or WEBM
   */
  async processVideo({ jobId, jobDir, canonicalUrl, format, quality, sanitizedTitle, onProgress }) {
    const outputFilename = `${sanitizedTitle}.${format}`;
    const outputTemplate = path.join(jobDir, `${sanitizedTitle}.%(ext)s`);

    // Build format selector based on requested quality
    let formatFilter = 'bestvideo+bestaudio/best';
    if (quality === '1080p') {
      formatFilter = 'bestvideo[height<=1080]+bestaudio/best[height<=1080]';
    } else if (quality === '720p') {
      formatFilter = 'bestvideo[height<=720]+bestaudio/best[height<=720]';
    } else if (quality === '480p') {
      formatFilter = 'bestvideo[height<=480]+bestaudio/best[height<=480]';
    } else if (quality === '360p') {
      formatFilter = 'bestvideo[height<=360]+bestaudio/best[height<=360]';
    }

    const args = withYouTubeCookies([
      '-m',
      'yt_dlp',
      '-f',
      formatFilter,
      '--merge-output-format',
      format,
      '--newline',
      '--no-playlist',
      '-o',
      outputTemplate,
      canonicalUrl
    ]);

    onProgress({ status: 'processing', percent: 15, message: `Downloading video (${quality.toUpperCase()})...` });

    await this.runProcess(config.pythonPath, args, jobDir, (percent, msg) => {
      const normalizedPercent = Math.round(15 + (percent * 0.8));
      onProgress({ status: 'processing', percent: normalizedPercent, message: msg });
    });

    const files = await fs.promises.readdir(jobDir);
    const videoFile = files.find(f => f.endsWith(`.${format}`));

    if (!videoFile) {
      throw new Error(`Failed to produce ${format.toUpperCase()} video file.`);
    }

    const finalPath = path.join(jobDir, videoFile);
    const stats = await fs.promises.stat(finalPath);

    onProgress({ status: 'ready', percent: 100, message: 'Video ready for download' });

    return {
      filePath: finalPath,
      fileName: outputFilename,
      mimeType: format === 'mp4' ? 'video/mp4' : 'video/webm',
      fileSize: stats.size
    };
  }

  /**
   * Helper to run CLI process and parse stdout percentage
   */
  runProcess(cmd, args, cwd, onProgressUpdate) {
    return new Promise((resolve, reject) => {
      const proc = spawn(cmd, args, {
        cwd,
        windowsHide: true
      });

      let lastPercent = 0;
      let stderrOutput = '';

      proc.stdout.on('data', (chunk) => {
        const text = chunk.toString();
        // Look for progress like "[download]  37.5% of 15.20MiB at 4.20MiB/s"
        const downloadMatch = text.match(/\[download\]\s+([\d\.]+)%/i);
        if (downloadMatch && downloadMatch[1]) {
          const pct = parseFloat(downloadMatch[1]);
          if (!isNaN(pct)) {
            lastPercent = pct;
            onProgressUpdate(pct, `Processing ${Math.round(pct)}%`);
          }
        } else if (text.includes('[Merger]') || text.includes('[ffmpeg]')) {
          onProgressUpdate(90, 'Remuxing and finalizing stream...');
        } else if (text.includes('[ExtractAudio]')) {
          onProgressUpdate(85, 'Extracting high-fidelity audio...');
        }
      });

      proc.stderr.on('data', (chunk) => {
        stderrOutput += chunk.toString();
      });

      proc.on('error', (err) => {
        reject(new Error(`Failed to launch media processor: ${err.message}`));
      });

      proc.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          logger.warn(`Media processor failed with code ${code}: ${stderrOutput}`);
          if (stderrOutput.includes('requested format not available')) {
            return reject(new Error('The requested quality is unavailable for this media.'));
          }
          if (stderrOutput.includes('HTTP Error 403') || stderrOutput.includes('Private video')) {
            return reject(new Error('Access to this media is restricted by the platform.'));
          }
          reject(new Error('Processing failed. Please check the URL or try another quality.'));
        }
      });
    });
  }
}

export const mediaProcessor = new MediaProcessor();
export default mediaProcessor;
