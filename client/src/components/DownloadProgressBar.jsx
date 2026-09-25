import React from 'react';
import { Download, Loader2, CheckCircle2, AlertCircle, RefreshCw, Sparkles, FileDown } from 'lucide-react';

export function DownloadProgressBar({
  downloadState,
  progressPercent,
  progressMessage,
  error,
  onDownload,
  onRetry,
  format,
  quality
}) {
  const isIdle = downloadState === 'idle';
  const isPreparing = downloadState === 'preparing';
  const isProcessing = downloadState === 'processing';
  const isReady = downloadState === 'ready';
  const isDownloading = downloadState === 'downloading';
  const isCompleted = downloadState === 'completed';
  const isFailed = downloadState === 'failed';

  const isBusy = isPreparing || isProcessing || isReady || isDownloading;

  return (
    <div className="space-y-4">
      {/* Primary Action Button */}
      {isIdle && (
        <button
          type="button"
          onClick={onDownload}
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-brand-cyan via-indigo-500 to-brand-indigo hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-base shadow-glow-cyan/50 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <Download className="w-5 h-5" />
          <span>Download ({format.toUpperCase()}{format !== 'jpg' ? ` • ${quality.toUpperCase()}` : ''})</span>
        </button>
      )}

      {/* Preparing State */}
      {isPreparing && (
        <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-slate-300 font-medium">
              <Loader2 className="w-4 h-4 text-brand-cyan animate-spin" />
              <span>Preparing...</span>
            </div>
            <span className="text-xs font-mono text-slate-500">{progressPercent}%</span>
          </div>
          <div className="w-full bg-dark-900 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className="bg-brand-cyan h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.max(5, progressPercent)}%` }}
            />
          </div>
        </div>
      )}

      {/* Processing State */}
      {isProcessing && (
        <div className="glass-panel p-5 rounded-xl border border-brand-cyan/30 shadow-glow-cyan/30 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-white font-medium">
              <Loader2 className="w-4 h-4 text-brand-cyan animate-spin" />
              <span>{progressMessage || `Processing ${progressPercent}%`}</span>
            </div>
            <span className="text-sm font-mono font-bold text-brand-cyan">
              {progressPercent}%
            </span>
          </div>

          <div className="w-full bg-dark-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-brand-cyan to-brand-indigo h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 text-center">
            Fetching video/audio stream and transcoding with FFmpeg...
          </p>
        </div>
      )}

      {/* Ready / Downloading State */}
      {(isReady || isDownloading) && (
        <div className="glass-panel p-5 rounded-xl border border-emerald-500/40 shadow-glow-cyan/20 space-y-2 text-center">
          <div className="inline-flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Download Ready</span>
          </div>
          <p className="text-xs text-slate-300">
            {isDownloading ? 'Transferring media file to your browser...' : 'Your download is starting automatically.'}
          </p>
        </div>
      )}

      {/* Completed State */}
      {isCompleted && (
        <div className="glass-panel p-5 rounded-xl border border-emerald-500/40 text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>Completed Successfully!</span>
          </div>
          <p className="text-xs text-slate-400">
            File has been downloaded to your browser.
          </p>
          <button
            type="button"
            onClick={onDownload}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-850 hover:bg-dark-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Download Another Format</span>
          </button>
        </div>
      )}

      {/* Failed State */}
      {isFailed && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-3">
          <div className="flex items-center gap-2.5 text-rose-300 text-sm font-semibold">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <span>{error || 'Processing failed. Please try again.'}</span>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onRetry || onDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-medium border border-rose-500/40 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      )}

      {/* Error under configuration */}
      {error && !isFailed && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
