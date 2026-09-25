import React from 'react';
import { Video, Music, Image as ImageIcon, Check } from 'lucide-react';

export function SupportedFormats() {
  const formats = [
    {
      ext: 'MP4',
      type: 'Video',
      icon: Video,
      color: 'from-cyan-500/20 to-blue-500/10',
      border: 'border-cyan-500/30',
      tagColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      desc: 'Standard H.264/AAC container compatible with all video players, iOS, Android, and desktop apps.',
      features: ['Up to 1080p Full HD', 'Universal playback compatibility', 'AAC audio stream included']
    },
    {
      ext: 'WEBM',
      type: 'Video',
      icon: Video,
      color: 'from-indigo-500/20 to-purple-500/10',
      border: 'border-indigo-500/30',
      tagColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      desc: 'Modern VP9 video with Opus audio codec, delivering superior compression and clarity on modern browsers.',
      features: ['High-efficiency VP9 codec', 'Opus multi-channel audio', 'Ideal for web streaming']
    },
    {
      ext: 'MP3',
      type: 'Audio',
      icon: Music,
      color: 'from-emerald-500/20 to-teal-500/10',
      border: 'border-emerald-500/30',
      tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      desc: 'Transcoded with FFmpeg libmp3lame at maximum 320 kbps bitrate for podcast and music playback.',
      features: ['320 kbps High Bitrate', 'Constant bitrate (CBR)', 'Compatible with all MP3 players']
    },
    {
      ext: 'WAV',
      type: 'Audio',
      icon: Music,
      color: 'from-violet-500/20 to-fuchsia-500/10',
      border: 'border-violet-500/30',
      tagColor: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
      desc: 'Studio-grade uncompressed linear PCM audio without lossy compression artifacts.',
      features: ['Lossless PCM stream', 'Perfect for audio editors (DAWs)', 'Zero compression degradation']
    },
    {
      ext: 'JPG',
      type: 'Thumbnail',
      icon: ImageIcon,
      color: 'from-amber-500/20 to-orange-500/10',
      border: 'border-amber-500/30',
      tagColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      desc: 'Direct extraction of maximum resolution cover artwork (up to 1280x720) in standard JPEG format.',
      features: ['Maxres default resolution', 'Full RGB color space', 'Clean JPEG image file']
    }
  ];

  return (
    <section id="formats" className="py-16 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Supported Output Formats
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Engineered with FFmpeg to output high-fidelity video, lossless audio, and cover art.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {formats.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.ext}
                className={`glass-panel p-6 rounded-2xl border ${f.border} bg-gradient-to-b ${f.color} flex flex-col justify-between hover:scale-[1.02] transition-transform duration-200`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black tracking-tight text-white font-mono">
                      {f.ext}
                    </span>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${f.tagColor}`}>
                      {f.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-6">
                    {f.desc}
                  </p>
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-800/60">
                  {f.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-400">
                      <Check className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
