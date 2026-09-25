import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'Why are some quality options marked "Unavailable"?',
      a: 'We inspect the exact video streams provided by YouTube. If a video was originally uploaded in 720p or lower, resolutions like 1080p will accurately display as "Unavailable" and cannot be selected. We never falsely upscale or fake quality options.'
    },
    {
      q: 'How does audio extraction (MP3 / WAV) work?',
      a: 'When you choose MP3 or WAV, our backend isolates the highest quality source audio stream and transcodes it server-side using FFmpeg with the libmp3lame encoder (at 320 kbps constant bitrate) or uncompressed linear PCM for WAV.'
    },
    {
      q: 'Are YouTube Shorts supported?',
      a: 'Yes! Both standard watch URLs (youtube.com/watch?v=...), short URLs (youtu.be/...), and Shorts (youtube.com/shorts/...) are fully supported.'
    },
    {
      q: 'Are downloaded files permanently saved on the server?',
      a: 'No. Files are generated strictly in an isolated temporary directory during processing, streamed as an attachment to your browser, and deleted automatically right after transfer or by our background garbage collector.'
    },
    {
      q: 'Does this service bypass DRM or private paywalled videos?',
      a: 'No. We strictly adhere to platform access limits and copyright requirements. Any content protected by DRM, private settings, age restrictions, or member paywalls cannot and will not be accessed.'
    }
  ];

  return (
    <section id="faq" className="py-16 border-t border-slate-800/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dark-900 border border-slate-800 text-xs font-medium text-slate-400 mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-brand-indigo" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="glass-panel rounded-xl border border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 text-sm font-semibold text-slate-200 hover:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-brand-cyan' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
