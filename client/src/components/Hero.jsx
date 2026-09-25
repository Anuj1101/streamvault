import React from 'react';
import { Search, Loader2, Clipboard, AlertCircle, Sparkles } from 'lucide-react';

export function Hero({
  url,
  setUrl,
  onAnalyze,
  isAnalyzing,
  error
}) {
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
      }
    } catch {
      // Clipboard permission denied
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isAnalyzing) {
      onAnalyze();
    }
  };

  const handleQuickSample = () => {
    setUrl('https://www.youtube.com/watch?v=jNQXAC9IVRw');
    onAnalyze('https://www.youtube.com/watch?v=jNQXAC9IVRw');
  };

  return (
    <section className="relative pt-12 pb-8 md:pt-20 md:pb-12 text-center max-w-4xl mx-auto px-4">
      {/* Decorative gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dark-900/90 border border-brand-cyan/20 text-xs font-medium text-brand-cyan mb-6 shadow-glow-cyan/50">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Lossless Audio & HD Video Processing</span>
      </div>

      {/* Main Heading */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight">
        Download Your <span className="bg-gradient-to-r from-brand-cyan via-indigo-300 to-brand-indigo bg-clip-text text-transparent">Media</span>
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-8 sm:mb-10 font-normal">
        Paste a media URL and choose the format and quality you need.
      </p>

      {/* Input Bar Card */}
      <div className="glass-panel p-2 sm:p-2.5 rounded-2xl shadow-glass border border-slate-700/60 transition-all focus-within:border-brand-cyan/60 focus-within:ring-2 focus-within:ring-brand-cyan/20">
        <div className="flex flex-col sm:flex-row items-center gap-2">
          {/* Search Icon */}
          <div className="hidden sm:flex items-center pl-3 text-slate-500">
            <Search className="w-5 h-5" />
          </div>

          {/* URL Input */}
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isAnalyzing}
            placeholder="Paste YouTube URL here... (e.g. https://www.youtube.com/watch?v=...)"
            className="w-full bg-transparent px-3 py-3 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none disabled:opacity-50"
          />

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
            <button
              type="button"
              onClick={handlePaste}
              title="Paste from clipboard"
              className="p-2.5 rounded-xl bg-dark-850 hover:bg-dark-800 text-slate-400 hover:text-slate-200 border border-slate-700/60 transition-colors"
            >
              <Clipboard className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onAnalyze()}
              disabled={isAnalyzing || !url.trim()}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-indigo hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-glow-cyan transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <span>Analyze</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center justify-center gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Sample Video shortcut */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
        <span>Need a test URL?</span>
        <button
          type="button"
          onClick={handleQuickSample}
          className="text-brand-cyan hover:underline font-medium focus:outline-none"
        >
          Load sample clip (Me at the zoo)
        </button>
      </div>
    </section>
  );
}
