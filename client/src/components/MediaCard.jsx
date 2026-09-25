import React from 'react';
import { ExternalLink, User, Clock, CheckCircle2, RotateCcw } from 'lucide-react';
import { truncate } from '../utils/formatters.js';

export function MediaCard({ media, onReset }) {
  if (!media) return null;

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-glass">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Analyzed Media
          </span>
        </div>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Analyze Another</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Thumbnail with overlay duration */}
        <div className="md:col-span-5 relative group overflow-hidden rounded-xl border border-slate-800 aspect-video bg-dark-900 flex items-center justify-center">
          {media.thumbnail ? (
            <img
              src={media.thumbnail}
              alt={media.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="text-slate-600 text-xs">No preview available</div>
          )}

          {/* Duration Badge */}
          {media.formattedDuration && (
            <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-white text-xs font-mono font-medium flex items-center gap-1 border border-white/10">
              <Clock className="w-3 h-3 text-brand-cyan" />
              <span>{media.formattedDuration}</span>
            </div>
          )}
        </div>

        {/* Media Details */}
        <div className="md:col-span-7 space-y-3.5">
          <h2 className="text-lg sm:text-xl font-bold text-white leading-snug line-clamp-2">
            {media.title}
          </h2>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            {/* Channel */}
            <div className="flex items-center gap-1.5 bg-dark-850 px-2.5 py-1 rounded-lg border border-slate-800">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-medium text-slate-300">{media.channel}</span>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-1.5 bg-dark-850 px-2.5 py-1 rounded-lg border border-slate-800">
              <Clock className="w-3.5 h-3.5 text-brand-cyan" />
              <span className="font-mono text-slate-300">{media.formattedDuration}</span>
            </div>

            {/* Source Link */}
            {media.canonicalUrl && (
              <a
                href={media.canonicalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-slate-400 hover:text-brand-cyan transition-colors"
              >
                <span>Watch Source</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <div className="pt-2 text-xs text-slate-500 font-mono">
            <span>Video ID: {media.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
