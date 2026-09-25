import React from 'react';
import { DownloadCloud, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-dark-950/90 py-12 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-cyan to-brand-indigo flex items-center justify-center">
              <DownloadCloud className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-300 text-sm">
              StreamVault
            </span>
            <span className="text-slate-600">|</span>
            <span>Production Media Downloader</span>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#formats" className="hover:text-white transition-colors">Formats</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <a href="#about" className="hover:text-white transition-colors">Terms & Usage</a>
          </div>

          {/* Copyright */}
          <div className="text-center sm:text-right text-slate-500">
            <p>© {new Date().getFullYear()} StreamVault. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
