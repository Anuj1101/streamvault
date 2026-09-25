import React from 'react';
import { Link2, SlidersHorizontal, Download, Sparkles } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Paste YouTube URL',
      desc: 'Enter any valid YouTube video, shorts, or youtu.be URL. The system validates the link against SSRF vulnerabilities.',
      icon: Link2,
      color: 'text-brand-cyan bg-brand-cyan/10 border-brand-cyan/20'
    },
    {
      step: '02',
      title: 'Inspect & Select Quality',
      desc: 'View verified metadata including duration, uploader, and detected resolutions (1080p, 720p, 480p, 360p, or Audio).',
      icon: SlidersHorizontal,
      color: 'text-brand-indigo bg-brand-indigo/10 border-brand-indigo/20'
    },
    {
      step: '03',
      title: 'Transcode & Download',
      desc: 'Click Download to initiate server-side extraction and remuxing via FFmpeg. Track real-time progress and stream directly.',
      icon: Download,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    }
  ];

  return (
    <section id="how-it-works" className="py-16 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dark-900 border border-slate-800 text-xs font-medium text-slate-400 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
            <span>Effortless 3-Step Workflow</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            How It Works
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Fast, secure, and respectful of source media constraints.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((st) => {
            const Icon = st.icon;
            return (
              <div
                key={st.step}
                className="glass-panel rounded-2xl p-6 border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${st.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black font-mono text-slate-800 group-hover:text-slate-700 transition-colors">
                    {st.step}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-2">
                  {st.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
