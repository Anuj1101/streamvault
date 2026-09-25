import React from 'react';
import { Video, Music, Image as ImageIcon, CheckCircle, Ban, Sparkles } from 'lucide-react';

export function DownloadConfig({
  media,
  selectedFormat,
  onSelectFormat,
  selectedQuality,
  onSelectQuality,
  disabled = false
}) {
  if (!media) return null;

  const isVideo = selectedFormat === 'mp4' || selectedFormat === 'webm';
  const isAudio = selectedFormat === 'mp3' || selectedFormat === 'wav';
  const isThumbnail = selectedFormat === 'jpg';

  const formatCategories = [
    {
      type: 'VIDEO',
      icon: Video,
      options: [
        { key: 'mp4', name: 'MP4', desc: 'Universal video (H.264/AAC)' },
        { key: 'webm', name: 'WEBM', desc: 'VP9 Web-optimized video' },
      ]
    },
    {
      type: 'AUDIO',
      icon: Music,
      options: [
        { key: 'mp3', name: 'MP3', desc: 'Stereo audio @ 320 kbps' },
        { key: 'wav', name: 'WAV', desc: 'Uncompressed lossless PCM' },
      ]
    },
    {
      type: 'THUMBNAIL',
      icon: ImageIcon,
      options: [
        { key: 'jpg', name: 'JPG', desc: 'Maxres cover art image' },
      ]
    }
  ];

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-slate-800 space-y-6">
      <div className="border-b border-slate-800/80 pb-4">
        <h3 className="text-base font-semibold text-white tracking-wide">
          Configuration Panel
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Select your target media format and resolution quality
        </p>
      </div>

      {/* 1. FORMAT SELECTION */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
          1. Select Format
        </label>

        <div className="space-y-4">
          {formatCategories.map((cat) => {
            const CatIcon = cat.icon;
            return (
              <div key={cat.type}>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 mb-2">
                  <CatIcon className="w-3.5 h-3.5 text-brand-cyan" />
                  <span>{cat.type}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                  {cat.options.map((fmt) => {
                    const isSelected = selectedFormat === fmt.key;
                    return (
                      <button
                        key={fmt.key}
                        type="button"
                        disabled={disabled}
                        onClick={() => onSelectFormat(fmt.key)}
                        className={`relative text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-brand-cyan/10 border-brand-cyan/60 shadow-glow-cyan/50 text-white'
                            : 'bg-dark-850/60 border-slate-800 hover:border-slate-700 text-slate-300'
                        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm">{fmt.name}</span>
                          </div>
                          {isSelected && (
                            <CheckCircle className="w-4 h-4 text-brand-cyan shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400">{fmt.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. QUALITY SELECTION */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            2. Select Quality
          </label>
          {isAudio && (
            <span className="text-[11px] text-brand-cyan font-medium">
              Audio Bitrate: High 320 kbps
            </span>
          )}
          {isThumbnail && (
            <span className="text-[11px] text-brand-cyan font-medium">
              Original HD Cover Image
            </span>
          )}
        </div>

        {isVideo ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {media.qualities.map((q) => {
              const isSelected = selectedQuality === q.key;
              const isAvailable = q.available;

              return (
                <button
                  key={q.key}
                  type="button"
                  disabled={disabled || !isAvailable}
                  onClick={() => isAvailable && onSelectQuality(q.key)}
                  className={`relative p-3 rounded-xl border text-center transition-all ${
                    !isAvailable
                      ? 'bg-dark-900/40 border-slate-900 text-slate-600 cursor-not-allowed opacity-60'
                      : isSelected
                      ? 'bg-brand-indigo/15 border-brand-indigo shadow-glow-indigo/50 text-white cursor-pointer'
                      : 'bg-dark-850/60 border-slate-800 hover:border-slate-700 text-slate-300 cursor-pointer'
                  } ${disabled ? 'cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <span className="font-semibold text-sm">{q.label}</span>
                    {isSelected && isAvailable && (
                      <CheckCircle className="w-3.5 h-3.5 text-brand-indigo shrink-0" />
                    )}
                  </div>

                  {/* Badge */}
                  <div>
                    {isAvailable ? (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {q.badge || 'Available'}
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-800 text-slate-500 flex items-center justify-center gap-1">
                        <Ban className="w-2.5 h-2.5" />
                        Unavailable
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-dark-850/50 border border-slate-800/80 text-xs text-slate-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-cyan shrink-0" />
            <span>
              {isAudio
                ? 'Audio tracks are automatically transcoded at original studio sample rate and optimal bit depth.'
                : 'Cover art thumbnail will be extracted at the maximum resolution provided by YouTube.'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
