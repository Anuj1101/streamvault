import React, { useRef, useEffect } from 'react';
import { Hero } from '../components/Hero.jsx';
import { MediaCard } from '../components/MediaCard.jsx';
import { DownloadConfig } from '../components/DownloadConfig.jsx';
import { DownloadProgressBar } from '../components/DownloadProgressBar.jsx';
import { SupportedFormats } from '../components/SupportedFormats.jsx';
import { HowItWorks } from '../components/HowItWorks.jsx';
import { FAQ } from '../components/FAQ.jsx';
import { LegalNotice } from '../components/LegalNotice.jsx';
import { useMediaDownloader } from '../hooks/useMediaDownloader.js';

export function HomePage() {
  const {
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
    handleAnalyze,
    handleDownload,
    handleReset
  } = useMediaDownloader();

  const resultsRef = useRef(null);

  // Auto scroll to results when media is analyzed
  useEffect(() => {
    if (media && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [media]);

  return (
    <div className="min-h-screen flex flex-col bg-radial-mesh">
      <main className="flex-1 pb-16">
        {/* Hero Section with URL Input */}
        <Hero
          url={url}
          setUrl={setUrl}
          onAnalyze={handleAnalyze}
          isAnalyzing={isAnalyzing}
          error={analyzeError}
        />

        {/* Media & Download Panel (Shown when analyzed) */}
        {media && (
          <section ref={resultsRef} className="max-w-4xl mx-auto px-4 mt-4 mb-16 space-y-6 animate-fadeIn">
            {/* Media Information Card */}
            <MediaCard media={media} onReset={handleReset} />

            {/* Download Configuration Panel */}
            <DownloadConfig
              media={media}
              selectedFormat={selectedFormat}
              onSelectFormat={setSelectedFormat}
              selectedQuality={selectedQuality}
              onSelectQuality={setSelectedQuality}
              disabled={downloadState === 'preparing' || downloadState === 'processing' || downloadState === 'downloading'}
            />

            {/* Action & Progress Bar */}
            <DownloadProgressBar
              downloadState={downloadState}
              progressPercent={progressPercent}
              progressMessage={progressMessage}
              error={downloadError}
              onDownload={handleDownload}
              onRetry={handleDownload}
              format={selectedFormat}
              quality={selectedQuality}
            />
          </section>
        )}

        {/* Informational Sections */}
        <SupportedFormats />
        <HowItWorks />
        <FAQ />
        <LegalNotice />
      </main>
    </div>
  );
}
