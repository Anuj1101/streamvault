import { useState, useEffect, useRef, useCallback } from 'react';
import { analyzeMedia, startDownload, getJobProgress, getFileDownloadUrl } from '../services/api.js';

export function useMediaDownloader() {
  const [url, setUrl] = useState('');
  const [media, setMedia] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState(null);

  const [selectedFormat, setSelectedFormat] = useState('mp4');
  const [selectedQuality, setSelectedQuality] = useState('original');

  // States: 'idle' | 'analyzing' | 'preparing' | 'processing' | 'ready' | 'downloading' | 'completed' | 'failed'
  const [downloadState, setDownloadState] = useState('idle');
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [downloadError, setDownloadError] = useState(null);
  const [activeJobId, setActiveJobId] = useState(null);

  const pollingRef = useRef(null);

  // Clear polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  // Update selected quality when media changes or format changes
  useEffect(() => {
    if (media && media.qualities) {
      // Find the best available quality
      const available = media.qualities.filter(q => q.available);
      if (available.length > 0) {
        // Prefer 'original' or '1080p' if available
        const hasOriginal = available.find(q => q.key === 'original');
        if (hasOriginal) {
          setSelectedQuality('original');
        } else {
          setSelectedQuality(available[0].key);
        }
      }
    }
  }, [media]);

  const handleAnalyze = async (inputUrl = url) => {
    const targetUrl = (inputUrl || '').trim();
    if (!targetUrl) {
      setAnalyzeError('Please enter a YouTube video URL.');
      return;
    }

    setAnalyzeError(null);
    setDownloadError(null);
    setIsAnalyzing(true);
    setMedia(null);
    setDownloadState('idle');
    setProgressPercent(0);

    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }

    try {
      const data = await analyzeMedia(targetUrl);
      if (data.success && data.media) {
        setMedia(data.media);
        setSelectedFormat('mp4');
      } else {
        throw new Error('Could not retrieve media details.');
      }
    } catch (err) {
      setAnalyzeError(err.message || 'Failed to analyze this YouTube URL.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  const triggerBrowserDownload = (jobId, fileName) => {
    setDownloadState('downloading');
    setProgressMessage('Streaming media to your device...');
    
    // Create link to trigger native browser save dialog
    const downloadUrl = getFileDownloadUrl(jobId);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', fileName || 'media');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloadState('completed');
      setProgressMessage('Download Complete!');
    }, 2000);
  };

  const handleDownload = async () => {
    if (!media) return;

    // Check if the selected quality is unavailable (for video)
    if (selectedFormat === 'mp4' || selectedFormat === 'webm') {
      const qObj = media.qualities.find(q => q.key === selectedQuality);
      if (qObj && !qObj.available) {
        setDownloadError(`The selected quality (${selectedQuality}) is unavailable for this video.`);
        return;
      }
    }

    setDownloadError(null);
    setDownloadState('preparing');
    setProgressPercent(5);
    setProgressMessage('Preparing request...');
    stopPolling();

    try {
      const response = await startDownload({
        url: media.canonicalUrl || url,
        format: selectedFormat,
        quality: selectedQuality
      });

      if (!response.success || !response.jobId) {
        throw new Error(response.error || 'Failed to initialize download job.');
      }

      const jobId = response.jobId;
      setActiveJobId(jobId);

      // Begin polling job progress
      pollingRef.current = setInterval(async () => {
        try {
          const pollRes = await getJobProgress(jobId);
          if (pollRes.success && pollRes.job) {
            const job = pollRes.job;
            setProgressPercent(job.percent || 0);

            if (job.status === 'preparing') {
              setDownloadState('preparing');
              setProgressMessage(job.message || 'Preparing...');
            } else if (job.status === 'processing') {
              setDownloadState('processing');
              setProgressMessage(job.message || `Processing ${job.percent}%`);
            } else if (job.status === 'ready') {
              stopPolling();
              setDownloadState('ready');
              setProgressMessage('Download Ready');
              setProgressPercent(100);
              // Trigger download
              triggerBrowserDownload(jobId, job.fileName);
            } else if (job.status === 'failed') {
              stopPolling();
              setDownloadState('failed');
              setDownloadError(job.error || 'Media processing failed.');
            }
          }
        } catch (pollErr) {
          // Keep polling unless persistent failure
        }
      }, 1000);

    } catch (err) {
      stopPolling();
      setDownloadState('failed');
      setDownloadError(err.message || 'Failed to start download.');
    }
  };

  const handleReset = () => {
    stopPolling();
    setMedia(null);
    setUrl('');
    setAnalyzeError(null);
    setDownloadError(null);
    setDownloadState('idle');
    setProgressPercent(0);
    setProgressMessage('');
    setActiveJobId(null);
  };

  return {
    url,
    setUrl,
    media,
    isAnalyzing,
    analyzeError,
    selectedFormat,
    setSelectedFormat,
    selectedQuality,
    setSelectedQuality,
    downloadState,
    progressPercent,
    progressMessage,
    downloadError,
    activeJobId,
    handleAnalyze,
    handleDownload,
    handleReset
  };
}
