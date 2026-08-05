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
  Zap,
  Globe,
  Sliders,
  CheckCircle2
} from 'lucide-react';

const HomePage = () => {
  const stats = [
    { label: 'Active Fleet Panels', value: '4,850+', change: '+12% YOY', color: 'text-forest-500' },
    { label: 'Avg System Efficiency', value: '21.8%', change: '+3.4% target gain', color: 'text-copper-600' },
    { label: 'Clean Energy Generated', value: '1.42 GWh', change: 'Cumulative total', color: 'text-primaryText dark:text-white' },
    { label: 'Carbon Offset Savings', value: '994 Tons', change: 'CO₂ emissions offset', color: 'text-olive-600' },
  ];

  const capabilities = [
    {
      icon: Activity,
      title: 'Real-Time Telemetry & Sensors',
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
      title: 'Photovoltaic Benchmarking',
      desc: 'Benchmark panel performance tolerances against rated STC capacity across rooftop, ground, and carport arrays.'
    },
    {
      icon: Layers,
      title: 'Multi-Format Compliance Export',
      desc: 'Generate compliance audit reports for daily, weekly, monthly, and annual operational reviews in PDF and CSV.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-warmBg dark:bg-[#121212] text-primaryText dark:text-neutral-100 transition-colors">
      
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 pt-16 pb-20 max-w-7xl mx-auto space-y-12 text-center">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-500/10 border border-forest-500/20 text-forest-500 font-semibold text-xs mx-auto">
          <Sun className="w-3.5 h-3.5 text-sand-400" />
          <span>Industrial Telemetry & Photovoltaic Intelligence</span>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-primaryText dark:text-white leading-tight">
            Enterprise Solar Fleet Monitoring & Telemetry Analytics
          </h1>
          <p className="text-base sm:text-lg text-secondaryText max-w-2xl mx-auto leading-relaxed">
            Maximize photovoltaic generation efficiency, automate thermal anomaly detection, and streamline field work orders for utility-scale solar installations.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-forest-500 hover:bg-forest-600 text-white font-semibold text-xs shadow-subtle flex items-center justify-center gap-2 transition-colors"
          >
            <span>Access Live Console</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/login"
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white hover:bg-slate-100 dark:hover:bg-[#202020] font-semibold text-xs transition-colors"
          >
            Operator Sign In
          </Link>
        </div>

        {/* Fleet Performance Stat Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto pt-8">
          {stats.map((item, idx) => (
            <div key={idx} className="saas-card p-4 text-left">
              <span className="text-[11px] font-semibold text-secondaryText block">{item.label}</span>
              <span className={`text-2xl font-bold tracking-tight block my-1 ${item.color}`}>
                {item.value}
              </span>
              <span className="text-[10px] text-slate-400">{item.change}</span>
            </div>
          ))}
        </div>

      </section>

      {/* Enterprise Capabilities Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#181818] border-y border-borderNeutral dark:border-[#262626]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primaryText dark:text-white">
              Built for Renewable Energy Enterprise Operations
            </h2>
            <p className="text-xs sm:text-sm text-secondaryText">
              Industrial IoT infrastructure engineered for high-frequency telemetry processing and zero-downtime grid synchronization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((cap, idx) => {
              const Icon = cap.icon;
              return (
                <div key={idx} className="p-5 rounded-2xl bg-warmBg dark:bg-[#202020] border border-borderNeutral dark:border-[#262626] space-y-3">
                  <div className="w-9 h-9 rounded-xl bg-forest-500/10 text-forest-500 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-primaryText dark:text-white">{cap.title}</h3>
                  <p className="text-xs text-secondaryText leading-relaxed">{cap.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
