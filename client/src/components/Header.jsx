import React, { useState, useEffect } from 'react';
import { DownloadCloud, ShieldCheck, HelpCircle, Info, ExternalLink, Menu, X } from 'lucide-react';
import { checkHealth } from '../services/api.js';

export function Header() {
  const [isOnline, setIsOnline] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkHealth()
      .then(() => setIsOnline(true))
      .catch(() => setIsOnline(false));
  }, []);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-dark-950/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-cyan to-brand-indigo flex items-center justify-center shadow-glow-cyan">
              <DownloadCloud className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                StreamVault
              </span>
              <span className="hidden sm:inline-block ml-2 px-1.5 py-0.5 text-[10px] font-mono font-medium uppercase tracking-wider rounded bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">
                PRO
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Home
            </button>
            <button onClick={() => scrollTo('how-it-works')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              How It Works
            </button>
            <button onClick={() => scrollTo('formats')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Formats
            </button>
            <button onClick={() => scrollTo('faq')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              FAQ
            </button>
            <button onClick={() => scrollTo('about')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              About
            </button>
          </nav>

          {/* Service Status Badge */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-dark-900 border border-slate-800 text-xs font-medium">
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
              <span className="text-slate-300">{isOnline ? 'Engine Active' : 'Service Offline'}</span>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-dark-850"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-dark-900/95 px-4 pt-2 pb-4 space-y-2">
          <button onClick={() => { setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="block w-full text-left py-2 px-3 rounded-lg text-slate-200 hover:bg-dark-800">
            Home
          </button>
          <button onClick={() => scrollTo('how-it-works')} className="block w-full text-left py-2 px-3 rounded-lg text-slate-200 hover:bg-dark-800">
            How It Works
          </button>
          <button onClick={() => scrollTo('formats')} className="block w-full text-left py-2 px-3 rounded-lg text-slate-200 hover:bg-dark-800">
            Supported Formats
          </button>
          <button onClick={() => scrollTo('faq')} className="block w-full text-left py-2 px-3 rounded-lg text-slate-200 hover:bg-dark-800">
            FAQ
          </button>
          <button onClick={() => scrollTo('about')} className="block w-full text-left py-2 px-3 rounded-lg text-slate-200 hover:bg-dark-800">
            About
          </button>
        </div>
      )}
    </header>
  );
}
