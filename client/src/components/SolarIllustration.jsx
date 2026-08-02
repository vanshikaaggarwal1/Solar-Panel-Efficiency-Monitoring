import React from 'react';

const SolarIllustration = () => {
  return (
    <div className="relative w-full max-w-lg aspect-square flex items-center justify-center p-4">
      {/* Background Animated Solar Rays Glow */}
      <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-solar-500/20 via-skyAccent-400/20 to-amber-500/30 blur-2xl animate-pulse-slow"></div>

      <svg viewBox="0 0 500 400" className="w-full h-full drop-shadow-2xl relative z-10">
        <defs>
          <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
          <linearGradient id="panelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="50%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
          <linearGradient id="gridLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Sun Element */}
        <circle cx="250" cy="80" r="45" fill="url(#sunGrad)" className="animate-pulse-slow" />
        <circle cx="250" cy="80" r="58" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="6 6" className="animate-spin-slow opacity-60" />

        {/* Sun Rays */}
        <line x1="250" y1="145" x2="250" y2="195" stroke="#F59E0B" strokeWidth="3" strokeDasharray="5 5" opacity="0.7" />
        <line x1="190" y1="110" x2="140" y2="170" stroke="#F59E0B" strokeWidth="3" strokeDasharray="5 5" opacity="0.7" />
        <line x1="310" y1="110" x2="360" y2="170" stroke="#F59E0B" strokeWidth="3" strokeDasharray="5 5" opacity="0.7" />

        {/* Ground Mount Stands */}
        <path d="M 120 280 L 100 350 M 200 280 L 190 350" stroke="#64748B" strokeWidth="6" strokeLinecap="round" />
        <path d="M 300 280 L 310 350 M 380 280 L 400 350" stroke="#64748B" strokeWidth="6" strokeLinecap="round" />

        {/* Photovoltaic Array 1 (Left Tilt) */}
        <polygon points="60,260 220,240 240,310 80,330" fill="url(#panelGrad)" stroke="#38BDF8" strokeWidth="3" />
        <line x1="140" y1="250" x2="160" y2="320" stroke="#38BDF8" strokeWidth="1.5" opacity="0.8" />
        <line x1="70" y1="295" x2="230" y2="275" stroke="#38BDF8" strokeWidth="1.5" opacity="0.8" />

        {/* Photovoltaic Array 2 (Right Tilt) */}
        <polygon points="260,240 420,260 440,330 280,310" fill="url(#panelGrad)" stroke="#38BDF8" strokeWidth="3" />
        <line x1="340" y1="250" x2="360" y2="320" stroke="#38BDF8" strokeWidth="1.5" opacity="0.8" />
        <line x1="270" y1="275" x2="430" y2="295" stroke="#38BDF8" strokeWidth="1.5" opacity="0.8" />

        {/* Energy Pulse Flow Lines */}
        <path d="M 160 320 Q 250 370 360 320" fill="none" stroke="url(#gridLineGrad)" strokeWidth="4" />
        <circle cx="250" cy="355" r="8" fill="#38BDF8" className="animate-ping" />
        <circle cx="250" cy="355" r="5" fill="#2E8B57" />

        {/* Telemetry Gateway Nodes */}
        <rect x="235" y="325" width="30" height="20" rx="4" fill="#0B1F33" stroke="#2E8B57" strokeWidth="2" />
        <circle cx="243" cy="335" r="2" fill="#22C55E" />
        <circle cx="257" cy="335" r="2" fill="#38BDF8" />
      </svg>
    </div>
  );
};

export default SolarIllustration;
