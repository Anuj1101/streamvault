import React from 'react';
import { ShieldAlert } from 'lucide-react';

export function LegalNotice() {
  return (
    <section id="about" className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="p-5 rounded-2xl bg-dark-900/60 border border-slate-800 flex items-start gap-4">
          <ShieldAlert className="w-5 h-5 text-brand-cyan shrink-0 mt-0.5" />
          <div className="text-xs text-slate-400 space-y-1">
            <h4 className="font-semibold text-slate-200">
              Responsible Usage & Rights Disclaimer
            </h4>
            <p>
              This tool is intended solely for downloading media where you own the copyright, have explicit permission from the rights holder, or for public domain and Creative Commons materials.
            </p>
            <p>
              We do not bypass DRM, circumvent authentication or access controls, or download restricted/private content. Please respect creators and platform Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
