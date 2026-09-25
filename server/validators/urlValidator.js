import { URL } from 'url';

const ALLOWED_HOSTNAMES = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'music.youtube.com',
  'youtu.be',
  'www.youtu.be'
]);

// Standard YouTube 11-character video ID regex
const VIDEO_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

export class ValidationError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = statusCode;
  }
}

/**
 * Validates YouTube URL and extracts canonical video ID and normalized URL
 * Enforces strict domain allowlist and SSRF prevention
 */
export function validateAndExtractYouTubeId(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string' || !rawUrl.trim()) {
    throw new ValidationError('A YouTube URL is required.');
  }

  const trimmed = rawUrl.trim();

  // Basic length sanity check
  if (trimmed.length > 500) {
    throw new ValidationError('URL exceeds maximum permitted length.');
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(trimmed);
  } catch {
    throw new ValidationError('Invalid URL format.');
  }

  // Ensure HTTP or HTTPS protocol only
  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw new ValidationError('Only standard http and https protocols are supported.');
  }

  const hostname = parsedUrl.hostname.toLowerCase();

  // SSRF guard: Disallow localhost, private IPs, loopback, or non-whitelisted hostnames
  if (!ALLOWED_HOSTNAMES.has(hostname)) {
    throw new ValidationError('Unsupported website. Only official YouTube URLs are accepted.');
  }

  let videoId = null;

  if (hostname === 'youtu.be' || hostname === 'www.youtu.be') {
    // Format: https://youtu.be/VIDEO_ID or https://youtu.be/VIDEO_ID?t=...
    const pathname = parsedUrl.pathname.replace(/^\/+/, '');
    const firstSegment = pathname.split('/')[0];
    if (firstSegment && VIDEO_ID_REGEX.test(firstSegment)) {
      videoId = firstSegment;
    }
  } else {
    // Formats:
    // https://www.youtube.com/watch?v=VIDEO_ID
    // https://www.youtube.com/shorts/VIDEO_ID
    // https://www.youtube.com/embed/VIDEO_ID
    // https://www.youtube.com/v/VIDEO_ID
    if (parsedUrl.searchParams.has('v')) {
      const v = parsedUrl.searchParams.get('v');
      if (v && VIDEO_ID_REGEX.test(v)) {
        videoId = v;
      }
    } else {
      const segments = parsedUrl.pathname.split('/').filter(Boolean);
      if (segments.length >= 2 && (segments[0] === 'shorts' || segments[0] === 'embed' || segments[0] === 'v')) {
        const id = segments[1];
        if (VIDEO_ID_REGEX.test(id)) {
          videoId = id;
        }
      }
    }
  }

  if (!videoId) {
    throw new ValidationError('Could not extract a valid YouTube video ID from the provided URL.');
  }

  // Return canonical standard URL to prevent URL spoofing / parameter injection
  const canonicalUrl = `https://www.youtube.com/watch?v=${videoId}`;

  return {
    videoId,
    canonicalUrl
  };
}

/**
 * Validates requested format and quality
 */
export function validateDownloadOptions(format, quality) {
  const validFormats = ['mp4', 'webm', 'mp3', 'wav', 'jpg'];
  const validQualities = ['original', '1080p', '720p', '480p', '360p'];

  const normalizedFormat = (format || '').toLowerCase().trim();
  const normalizedQuality = (quality || '').toLowerCase().trim();

  if (!validFormats.includes(normalizedFormat)) {
    throw new ValidationError(`Unsupported format: ${format}. Supported formats are: ${validFormats.join(', ')}`);
  }

  if (normalizedFormat !== 'jpg' && !validQualities.includes(normalizedQuality)) {
    throw new ValidationError(`Unsupported quality: ${quality}. Supported qualities are: ${validQualities.join(', ')}`);
  }

  return {
    format: normalizedFormat,
    quality: normalizedQuality
  };
}
