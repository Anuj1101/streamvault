import { spawn } from 'child_process';
import config from '../config/index.js';
import logger from '../utils/logger.js';
import withYouTubeCookies from '../utils/ytDlpArgs.js';

function formatSeconds(totalSeconds) {
  if (!totalSeconds || isNaN(totalSeconds)) return '0:00';
  const sec = Math.floor(totalSeconds % 60);
  const min = Math.floor((totalSeconds / 60) % 60);
  const hrs = Math.floor(totalSeconds / 3600);

  const paddedSec = sec < 10 ? `0${sec}` : `${sec}`;
  if (hrs > 0) {
    const paddedMin = min < 10 ? `0${min}` : `${min}`;
    return `${hrs}:${paddedMin}:${paddedSec}`;
  }
  return `${min}:${paddedSec}`;
}

export class YtDlpProvider {
  /**
   * Fetches metadata for a given YouTube canonical URL using yt-dlp
   */
  async getMetadata(canonicalUrl) {
    return new Promise((resolve, reject) => {
      const args = withYouTubeCookies([
        '-m',
        'yt_dlp',
        '--dump-single-json',
        '--no-playlist',
        '--no-warnings',
        '--skip-download',
        canonicalUrl
      ]);

      logger.info(`Fetching metadata for URL: ${canonicalUrl}`);
      const proc = spawn(config.pythonPath, args, {
        windowsHide: true
      });

      let stdout = '';
      let stderr = '';

      proc.stdout.on('data', (chunk) => {
        stdout += chunk.toString();
      });

      proc.stderr.on('data', (chunk) => {
        stderr += chunk.toString();
      });

      proc.on('error', (err) => {
        logger.error('Failed to spawn yt-dlp process:', { error: err.message });
        reject(new Error('Media metadata extractor is unavailable.'));
      });

      proc.on('close', (code) => {
        if (code !== 0) {
          logger.warn(`yt-dlp exited with code ${code}: ${stderr.trim()}`);
          if (stderr.includes('Private video') || stderr.includes('Sign in if you\'ve been granted access')) {
            return reject(new Error('This video is private or restricted. Access cannot be granted.'));
          }
          if (stderr.includes('Join this channel') || stderr.includes('members-only')) {
            return reject(new Error('This video is members-only content and cannot be accessed.'));
          }
          if (stderr.includes('DRM') || stderr.includes('protected')) {
            return reject(new Error('This media is protected by DRM and cannot be downloaded.'));
          }
          if (stderr.includes('Video unavailable') || stderr.includes('not available')) {
            return reject(new Error('This video is unavailable or has been removed.'));
          }
          return reject(new Error('Could not analyze the provided media URL.'));
        }

        try {
          const info = JSON.parse(stdout);
          const parsed = this.parseMetadata(info, canonicalUrl);
          resolve(parsed);
        } catch (err) {
          logger.error('Failed to parse yt-dlp metadata JSON:', { error: err.message });
          reject(new Error('Failed to parse media metadata from source.'));
        }
      });
    });
  }

  parseMetadata(info, canonicalUrl) {
    const formats = Array.isArray(info.formats) ? info.formats : [];
    
    // Find highest video resolution height
    let maxHeight = 0;
    const availableHeights = new Set();

    formats.forEach((f) => {
      // Check if this format has video
      if (f.vcodec && f.vcodec !== 'none' && f.height) {
        availableHeights.add(f.height);
        if (f.height > maxHeight) {
          maxHeight = f.height;
        }
      }
    });

    const targetQualities = [
      { key: 'original', label: 'Original', minHeight: 0, available: maxHeight > 0 },
      { key: '1080p', label: '1080p', minHeight: 1080, available: maxHeight >= 1080 },
      { key: '720p', label: '720p', minHeight: 720, available: maxHeight >= 720 },
      { key: '480p', label: '480p', minHeight: 480, available: maxHeight >= 480 },
      { key: '360p', label: '360p', minHeight: 360, available: maxHeight >= 360 }
    ];

    // Determine best available thumbnail
    let thumbnail = info.thumbnail;
    if (Array.isArray(info.thumbnails) && info.thumbnails.length > 0) {
      // pick highest resolution thumbnail
      const sortedThumbs = [...info.thumbnails].sort((a, b) => (b.width || 0) - (a.width || 0));
      thumbnail = sortedThumbs[0].url || thumbnail;
    }

    return {
      id: info.id,
      title: info.title || 'Untitled Media',
      channel: info.uploader || info.channel || 'Unknown Channel',
      duration: info.duration || 0,
      formattedDuration: formatSeconds(info.duration),
      thumbnail: thumbnail || '',
      webpageUrl: canonicalUrl,
      maxHeight,
      qualities: targetQualities.map(q => ({
        key: q.key,
        label: q.label,
        available: q.available,
        badge: q.available ? (q.key === 'original' ? `${maxHeight}p` : null) : 'Unavailable'
      })),
      formats: {
        video: [
          { key: 'mp4', label: 'MP4', description: 'Universal format (H.264/AAC)' },
          { key: 'webm', label: 'WEBM', description: 'Web-optimized (VP9/Opus)' }
        ],
        audio: [
          { key: 'mp3', label: 'MP3', description: 'High Quality (320kbps)' },
          { key: 'wav', label: 'WAV', description: 'Lossless Uncompressed PCM' }
        ],
        thumbnail: [
          { key: 'jpg', label: 'JPG', description: 'Full resolution cover image' }
        ]
      }
    };
  }
}

export const ytDlpProvider = new YtDlpProvider();
export default ytDlpProvider;
