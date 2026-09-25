/**
 * Application Logger
 */
const formatTime = () => new Date().toISOString();

export const logger = {
  info: (message, meta = {}) => {
    console.log(`[INFO]  [${formatTime()}] ${message}`, Object.keys(meta).length ? meta : '');
  },
  warn: (message, meta = {}) => {
    console.warn(`[WARN]  [${formatTime()}] ${message}`, Object.keys(meta).length ? meta : '');
  },
  error: (message, meta = {}) => {
    console.error(`[ERROR] [${formatTime()}] ${message}`, Object.keys(meta).length ? meta : '');
  },
  debug: (message, meta = {}) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEBUG] [${formatTime()}] ${message}`, Object.keys(meta).length ? meta : '');
    }
  }
};

export default logger;
