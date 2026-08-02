import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import {
  Sun,
  Activity,
  BarChart3,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight,
  CheckCircle2,
  Zap,
  Globe,
  Sliders
} from 'lucide-react';

const HomePage = () => {
  const stats = [
    { label: 'Active Fleet Panels', value: '4,850+', change: '+12% YOY', color: 'text-forest-500' },
    { label: 'Avg System Efficiency', value: '22.8%', change: '+3.4% target gain', color: 'text-copper-500' },
    { label: 'Clean Energy Generated', value: '1.42 GWh', change: 'Cumulative total', color: 'text-primaryText' },
    { label: 'Carbon Offset Savings', value: '994 Tons', change: 'CO₂ emissions offset', color: 'text-olive-500' },
  ];

  const capabilities = [
    {
      icon: Activity,
      title: 'Real-Time Sensor Telemetry',
      desc: 'High-frequency telemetry ingestion monitoring active power output (kW), voltage, current, irradiance, and thermal coefficients.'
    },
    {
      icon: BarChart3,
      title: 'Predictive Yield Analytics',
      desc: 'Executive analytics suite identifying thermal hotspots, string mismatch losses, and seasonal efficiency degradation.'
    },
    {
      icon: ShieldCheck,
      title: 'Automated Anomaly Center',
      desc: 'Instant alert logging for cell overheating (>55°C), low conversion yield, low DC bus voltage, and gateway disconnects.'
    },
    {
      icon: Cpu,
      title: 'Field Maintenance Dispatch',
      desc: 'Schedule field technicians, log bypass diode repairs, track component replacements, and manage resolution timelines.'
    },
    {
      icon: Sliders,
      title: 'Photovoltaic Benchmarks',
      desc: 'Benchmark panel performance tolerances against rated STC capacity across rooftop, ground, and carport arrays.'
    },
    {
      icon: Layers,
      title: 'Multi-Format Audit Export',
      desc: 'Generate compliance audit reports for daily, weekly, monthly, and annual operational reviews in PDF and CSV.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-warmBg dark:bg-[#121212] transition-colors">
      
      {/* Hero Section */}
      <section className="pt-16 pb-20 border-b border-borderNeutral dark:border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6 text-left">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-[#1C1C1C] border border-borderNeutral dark:border-[#333] text-xs font-semibold text-forest-500">
              <span className="w-1.5 h-1.5 rounded-full bg-forest-500"></span> Solarix Enterprise Operating Platform
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primaryText dark:text-white tracking-tight leading-tight">
              Photovoltaic Efficiency & Telemetry Analytics
            </h1>

            <p className="text-base sm:text-lg text-secondaryText font-normal leading-relaxed max-w-2xl">
              An enterprise-grade IoT platform built for renewable energy companies, asset managers, and field engineering teams to monitor solar performance and maximize power generation yield.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-forest-500 hover:bg-forest-600 text-white font-semibold text-xs shadow-subtle flex items-center justify-center gap-2 transition-colors"
              >
                <span>Launch Enterprise Console</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white dark:bg-[#1C1C1C] text-primaryText dark:text-white font-semibold text-xs border border-borderNeutral dark:border-[#333] hover:bg-slate-50 transition-colors flex items-center justify-center"
              >
                Operator Sign In
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-4 text-xs text-secondaryText">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-forest-500" /> Enterprise JWT Security</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-forest-500" /> RESTful Telemetry Gateway</span>
            </div>

          </div>
        </div>
      </section>

      {/* Metrics Banner */}
      <section className="py-12 bg-white dark:bg-[#181818] border-b border-borderNeutral dark:border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, idx) => (
              <div key={idx} className="space-y-1">
                <span className="text-xs font-semibold text-secondaryText block">{s.label}</span>
                <span className={`text-3xl font-bold tracking-tight ${s.color} dark:text-white block`}>{s.value}</span>
                <span className="text-[11px] text-slate-400 block">{s.change}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Capabilities Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold text-forest-500 uppercase tracking-wider">Platform Capabilities</span>
          <h2 className="text-3xl font-bold text-primaryText dark:text-white tracking-tight">
            Designed for Commercial & Industrial Solar Farms
          </h2>
          <p className="text-xs text-secondaryText">
            Robust telemetry monitoring, automated diagnostics, and maintenance dispatching.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={i} className="saas-card p-6 space-y-3">
                <div className="w-9 h-9 rounded-lg bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-forest-500 flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-primaryText dark:text-white">{c.title}</h3>
                <p className="text-xs text-secondaryText leading-relaxed">{c.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
