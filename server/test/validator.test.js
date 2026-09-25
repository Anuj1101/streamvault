import { validateAndExtractYouTubeId, validateDownloadOptions } from '../validators/urlValidator.js';

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log('Running URL Validator Tests...');

// 1. Valid standard watch URL
const res1 = validateAndExtractYouTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
assert(res1.videoId === 'dQw4w9WgXcQ', 'Failed standard watch url');
assert(res1.canonicalUrl === 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Canonical url mismatch');

// 2. Valid short URL (youtu.be)
const res2 = validateAndExtractYouTubeId('https://youtu.be/dQw4w9WgXcQ?si=123');
assert(res2.videoId === 'dQw4w9WgXcQ', 'Failed youtu.be short url');

// 3. Valid Shorts URL
const res3 = validateAndExtractYouTubeId('https://www.youtube.com/shorts/dQw4w9WgXcQ');
assert(res3.videoId === 'dQw4w9WgXcQ', 'Failed shorts url');

// 4. Invalid hostname (SSRF attempt)
try {
  validateAndExtractYouTubeId('https://evil-site.com/watch?v=dQw4w9WgXcQ');
  assert(false, 'Should have rejected evil hostname');
} catch (err) {
  assert(err.message.includes('Unsupported website'), 'Expected unsupported website error');
}

// 5. Localhost / Private IP attempt (SSRF attempt)
try {
  validateAndExtractYouTubeId('http://127.0.0.1:8080/watch?v=dQw4w9WgXcQ');
  assert(false, 'Should have rejected localhost');
} catch (err) {
  assert(err.message.includes('Unsupported website'), 'Expected unsupported website error for IP');
}

// 6. Malformed video ID
try {
  validateAndExtractYouTubeId('https://www.youtube.com/watch?v=short');
  assert(false, 'Should have rejected short ID');
} catch (err) {
  assert(err.message.includes('valid YouTube video ID'), 'Expected malformed ID error');
}

// 7. Validate options
const opt1 = validateDownloadOptions('MP4', '720P');
assert(opt1.format === 'mp4' && opt1.quality === '720p', 'Download options normalization failed');

console.log('✓ All URL Validator Tests Passed!');
