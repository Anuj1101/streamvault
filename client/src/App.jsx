import React from 'react';
import { Header } from './components/Header.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { Footer } from './components/Footer.jsx';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-dark-950 text-slate-100 selection:bg-brand-cyan/20 selection:text-brand-cyan">
      <Header />
      <div className="flex-1">
        <HomePage />
      </div>
      <Footer />
    </div>
  );
}
