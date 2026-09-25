import axios from 'axios';

const api = axios.create({
  baseURL: '/api/media',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000 // 30s timeout for analyze/start requests
});

export async function checkHealth() {
  const response = await api.get('/health');
  return response.data;
}

export async function analyzeMedia(url) {
  try {
    const response = await api.post('/analyze', { url });
    return response.data;
  } catch (err) {
    const message = err.response?.data?.error || err.message || 'Failed to analyze media.';
    throw new Error(message);
  }
}

export async function startDownload({ url, format, quality }) {
  try {
    const response = await api.post('/download', { url, format, quality });
    return response.data;
  } catch (err) {
    const message = err.response?.data?.error || err.message || 'Failed to initiate download.';
    throw new Error(message);
  }
}

export async function getJobProgress(jobId) {
  try {
    const response = await api.get(`/progress/${jobId}`);
    return response.data;
  } catch (err) {
    const message = err.response?.data?.error || err.message || 'Failed to check progress.';
    throw new Error(message);
  }
}

export function getFileDownloadUrl(jobId) {
  return `/api/media/file/${jobId}`;
}

export default {
  checkHealth,
  analyzeMedia,
  startDownload,
  getJobProgress,
  getFileDownloadUrl
};
