/**
 * Format seconds into mm:ss or hh:mm:ss
 */
export function formatDuration(totalSeconds) {
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

/**
 * Format bytes into human readable MB, GB
 */
export function formatBytes(bytes) {
  if (!bytes || isNaN(bytes)) return '';
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(2)} GB`;
}

/**
 * Truncate long string
 */
export function truncate(text, maxLen = 60) {
  if (!text) return '';
  return text.length > maxLen ? text.substring(0, maxLen) + '...' : text;
}
