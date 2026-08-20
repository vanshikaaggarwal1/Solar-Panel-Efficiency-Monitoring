import React from 'react';
import { Link } from 'react-router-dom';
import solarVideo from '../assets/home_solar.mp4';
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
  Sliders,
  Database,
  AlertTriangle,
  Wrench,
  TrendingUp,
  Radio,
  CheckCircle2,
  ChevronRight,
  Server,
  Code2,
  Sparkles,
  Gauge,
  FileText,
  Thermometer,
  Layers3,
  Check,
  Globe
} from 'lucide-react';

const HomePage = () => {
  // Fleet performance hero stats
  const stats = [
    { label: 'Active Panels Monitored', value: '4,850+', change: '+12% YOY expansion', color: 'text-forest-500 dark:text-sage-400' },
    { label: 'Avg System Efficiency', value: '21.8%', change: '+3.4% target gain', color: 'text-copper-500' },
    { label: 'Clean Energy Generated', value: '1.42 GWh', change: 'Cumulative total', color: 'text-primaryText dark:text-white' },
    { label: 'Carbon Offset Savings', value: '994 Tons', change: 'CO₂ emissions offset', color: 'text-olive-600 dark:text-sage-400' },
  ];

  // How Solarix Works 5-step workflow
  const workflowSteps = [
    {
      num: '01',
      title: 'COLLECT',
      desc: 'Sensors capture power, voltage, current, temperature and irradiance.',
      icon: Database,
      tag: 'IoT Sensors'
    },
    {
      num: '02',
      title: 'PROCESS',
      desc: 'Solarix receives and organizes incoming telemetry in real time.',
      icon: Cpu,
      tag: 'Edge Ingestion'
    },
    {
      num: '03',
      title: 'ANALYZE',
      desc: 'Performance and efficiency are continuously evaluated against baselines.',
      icon: BarChart3,
      tag: 'Yield Engine'
    },
    {
      num: '04',
      title: 'DETECT',
      desc: 'The system identifies abnormal behavior and potential thermal faults.',
      icon: AlertTriangle,
      tag: 'Anomaly Scanner'
    },
    {
      num: '05',
      title: 'ACT',
      desc: 'Operators receive alerts and take targeted maintenance action.',
      icon: Wrench,
      tag: 'Dispatch Control'
    }
  ];

  // Insights minimal metric cards
  const insightsMetrics = [
    {
      value: '21.8%',
      label: 'Average Efficiency',
      subtext: '+3.4% vs STC baseline',
      icon: Activity,
      color: 'text-forest-500 dark:text-sage-400'
    },
    {
      value: '1.42 GWh',
      label: 'Energy Generated',
      subtext: 'Cumulative total output',
      icon: Zap,
      color: 'text-copper-500'
    },
    {
      value: '994 Tons',
      label: 'CO₂ Offset',
      subtext: 'Emissions offset',
      icon: Sun,
      color: 'text-olive-600 dark:text-sage-400'
    },
    {
      value: '+12%',
      label: 'Fleet Growth',
      subtext: 'Year-over-Year',
      icon: TrendingUp,
      color: 'text-primaryText dark:text-white'
    }
  ];

  // About 3 value cards
  const valueCards = [
    {
      title: 'Centralized Monitoring',
      desc: 'Bring solar fleet data into one unified platform with real-time sensor streams.',
      icon: Server,
    },
    {
      title: 'Data-Driven Decisions',
      desc: 'Convert telemetry into meaningful operational insights and predictive yield trends.',
      icon: BarChart3,
    },
    {
      title: 'Smarter Maintenance',
      desc: 'Identify problems early and improve maintenance response with automated work orders.',
      icon: Wrench,
    }
  ];

  // Technology stack badges
  const techBadges = ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Chart.js', 'JWT'];

  return (
    <div className="min-h-screen flex flex-col bg-warmBg dark:bg-[#121212] text-primaryText dark:text-neutral-100 transition-colors selection:bg-forest-500 selection:text-white">

      {/* ================= 1. HERO SECTION (#home) ================= */}
      <section id="home" className="relative overflow-hidden px-4 sm:px-6 lg:px-8 pt-16 pb-24 text-center scroll-mt-20">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={solarVideo} type="video/mp4" />
        </video>

        {/* Layered Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-warmBg dark:to-[#121212]" />

        <div className="relative z-10 max-w-7xl mx-auto space-y-12 animate-fade-in-up">
          {/* Top Small Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-500/20 border border-forest-500/40 text-emerald-300 font-semibold text-xs mx-auto backdrop-blur-md shadow-subtle tracking-wide uppercase">
            <Sun className="w-3.5 h-3.5 text-sand-400" />
            <span>Enterprise Solar Intelligence</span>
          </div>

          {/* Heading & Subtitle */}
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Enterprise Solar Fleet Monitoring & Telemetry Analytics
            </h1>
            <p className="text-sm sm:text-base text-gray-200 max-w-2xl mx-auto leading-relaxed">
              Monitor photovoltaic performance, detect thermal anomalies in real time, and optimize clean energy generation across utility-scale solar arrays.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-forest-500 hover:bg-forest-600 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 glow-forest"
            >
              <span>Access Live Console</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 font-semibold text-xs transition-all transform hover:-translate-y-0.5"
            >
              Explore Platform
            </a>
          </div>

       
          {/* <div className="max-w-sm mx-auto pt-2">
            <div className="glass-panel dark:bg-[#181818]/85 border-white/20 dark:border-[#333] glow-forest text-left p-4 rounded-2xl shadow-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 dark:border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block"></span>
                  <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-400 dark:text-emerald-400 uppercase">
                    SYSTEM OPERATIONAL
                  </span>
                </div>
                <span className="text-[9px] font-mono text-gray-300 dark:text-gray-400">Node #804</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center py-1">
                <div className="bg-black/20 dark:bg-black/30 p-2 rounded-xl border border-white/5">
                  <span className="text-[9px] text-gray-300 dark:text-gray-400 block">Efficiency</span>
                  <span className="text-xs font-bold text-emerald-400 block mt-0.5">21.8%</span>
                </div>
                <div className="bg-black/20 dark:bg-black/30 p-2 rounded-xl border border-white/5">
                  <span className="text-[9px] text-gray-300 dark:text-gray-400 block">Power</span>
                  <span className="text-xs font-bold text-white block mt-0.5">428 kW</span>
                </div>
                <div className="bg-black/20 dark:bg-black/30 p-2 rounded-xl border border-white/5">
                  <span className="text-[9px] text-gray-300 dark:text-gray-400 block">Temp</span>
                  <span className="text-xs font-bold text-copper-400 block mt-0.5">42°C</span>
                </div>
              </div>

              
              <div className="flex items-center justify-between text-[9px] text-gray-300 dark:text-gray-400 pt-1">
                <span>Grid Sync Stability</span>
                <span className="text-emerald-400 font-mono">99.8% Nominal</span>
              </div>
            </div>
          </div> */}

          {/* Premium Floating Metrics Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto pt-6">
            {stats.map((item, idx) => (
              <div
                key={idx}
                className=" p-4 text-left rounded-2xl bg-warmBg dark:bg-[#181818]/90 border-white/20 dark:border-[#2A2A2A] shadow-subtle hover:-translate-y-1 transition-transform"
              >
                <span className="text-[11px] font-semibold text-secondaryText dark:text-gray-400 block">{item.label}</span>
                <span className={`text-2xl font-bold tracking-tight block my-1 ${item.color}`}>
                  {item.value}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">{item.change}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 2. TRUST / PRODUCT SIGNAL SECTION ================= */}
      <section className="bg-[#161B18] dark:bg-[#121614] border-y border-forest-500/20 py-8 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-7xl mx-auto space-y-4 text-center">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400/80 block">
            Built for modern solar operations
          </span>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-1">
            {[
              { label: 'REAL-TIME TELEMETRY', icon: Activity },
              { label: 'PERFORMANCE ANALYTICS', icon: BarChart3 },
              { label: 'ANOMALY DETECTION', icon: AlertTriangle },
              { label: 'FIELD MAINTENANCE', icon: Wrench },
              { label: 'OPERATIONAL REPORTING', icon: FileText }
            ].map((badge, idx) => {
              const BadgeIcon = badge.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-forest-500/40 text-[11px] font-semibold text-gray-300 transition-colors"
                >
                  <BadgeIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{badge.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= 3. HOW IT WORKS SECTION (#how-it-works) ================= */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-warmBg dark:bg-[#121212] border-b border-borderNeutral dark:border-[#262626] relative bg-grid-pattern scroll-mt-20">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-500/10 border border-forest-500/20 text-forest-500 dark:text-emerald-400 font-semibold text-[11px] uppercase tracking-wider">
              <Radio className="w-3 h-3 text-copper-500" />
              <span>Workflow Pipeline</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-primaryText dark:text-white">
              From Solar Data to Smarter Decisions
            </h2>
            <p className="text-xs sm:text-sm text-secondaryText dark:text-gray-400 max-w-xl mx-auto">
              Solarix ingests continuous telemetry streams, runs real-time diagnostic algorithms, and equips field teams to take targeted operational action.
            </p>
          </div>

          {/* Desktop Timeline (Horizontal 5 Steps) */}
          <div className="hidden lg:grid grid-cols-5 gap-3 relative">
            {workflowSteps.map((item, idx) => {
              const StepIcon = item.icon;
              return (
                <div
                  key={idx}
                  className="relative flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-[#181818] border border-borderNeutral dark:border-[#262626] hover:border-forest-500/40 dark:hover:border-forest-500/40 transition-all duration-300 shadow-subtle hover:-translate-y-1 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold text-forest-500 dark:text-emerald-400 bg-forest-500/10 dark:bg-emerald-500/10 px-2 py-0.5 rounded">
                        {item.num}
                      </span>
                      <div className="w-8 h-8 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#2A2A2A] text-forest-500 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <StepIcon className="w-4 h-4" />
                      </div>
                    </div>

                    <h3 className="text-xs font-bold text-primaryText dark:text-white tracking-wide">{item.title}</h3>
                    <p className="text-xs text-secondaryText dark:text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>

                  {/* Step Tag */}
                  <div className="pt-3 border-t border-borderNeutral/60 dark:border-[#262626]">
                    <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded bg-warmBg dark:bg-[#222] text-tertiaryText dark:text-gray-300 border border-borderNeutral dark:border-[#2A2A2A]">
                      {item.tag}
                    </span>
                  </div>

                  {/* Arrow Connector */}
                  {idx < workflowSteps.length - 1 && (
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white dark:bg-[#222] border border-borderNeutral dark:border-[#333] flex items-center justify-center text-forest-500 dark:text-emerald-400 shadow-sm">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile Timeline (Vertical Stack) */}
          <div className="lg:hidden space-y-3">
            {workflowSteps.map((item, idx) => {
              const StepIcon = item.icon;
              return (
                <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-[#181818] border border-borderNeutral dark:border-[#262626] shadow-subtle flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-forest-500/10 text-forest-500 shrink-0 flex items-center justify-center font-bold text-xs">
                    {item.num}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-primaryText dark:text-white flex items-center gap-2">
                        <span>{item.title}</span>
                      </h3>
                      <StepIcon className="w-3.5 h-3.5 text-forest-500" />
                    </div>
                    <p className="text-xs text-secondaryText dark:text-gray-400">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= 4. FEATURES BENTO GRID SECTION (#features) ================= */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#181818] border-b border-borderNeutral dark:border-[#262626] scroll-mt-20">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-500/10 border border-forest-500/20 text-forest-500 dark:text-emerald-400 font-semibold text-[11px] uppercase tracking-wider">
              <Activity className="w-3 h-3 text-forest-500" />
              <span>Platform Capabilities</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primaryText dark:text-white">
              Built for Renewable Energy Enterprise Operations
            </h2>
            <p className="text-xs sm:text-sm text-secondaryText dark:text-gray-400">
              Industrial IoT infrastructure engineered for high-frequency telemetry processing and zero-downtime grid synchronization.
            </p>
          </div>

          {/* Bento-style Feature Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Card 1: Large Featured Card (Spans 2 cols on lg) */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-warmBg dark:bg-[#202020] border border-borderNeutral dark:border-[#262626] space-y-4 hover:border-forest-500/40 dark:hover:border-forest-500/40 transition-all duration-300 shadow-subtle group">
              <div className="w-10 h-10 rounded-xl bg-forest-500/10 text-forest-500 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-primaryText dark:text-white">Real-Time Telemetry & Sensors</h3>
                <p className="text-xs text-secondaryText dark:text-gray-400 leading-relaxed max-w-xl">
                  High-frequency telemetry ingestion monitoring active power output (kW), DC voltage, string current, irradiance, and thermal coefficients across active solar arrays.
                </p>
              </div>

              {/* Mini Sensor Values UI Element */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                <div className="p-2.5 rounded-xl bg-white dark:bg-[#181818] border border-borderNeutral dark:border-[#2A2A2A] text-left">
                  <span className="text-[9px] text-secondaryText dark:text-gray-400 block">Power</span>
                  <span className="text-xs font-mono font-bold text-forest-500 dark:text-emerald-400">428.4 kW</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-[#181818] border border-borderNeutral dark:border-[#2A2A2A] text-left">
                  <span className="text-[9px] text-secondaryText dark:text-gray-400 block">Bus Voltage</span>
                  <span className="text-xs font-mono font-bold text-primaryText dark:text-white">680 V</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-[#181818] border border-borderNeutral dark:border-[#2A2A2A] text-left">
                  <span className="text-[9px] text-secondaryText dark:text-gray-400 block">Current</span>
                  <span className="text-xs font-mono font-bold text-primaryText dark:text-white">14.2 A</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-[#181818] border border-borderNeutral dark:border-[#2A2A2A] text-left">
                  <span className="text-[9px] text-secondaryText dark:text-gray-400 block">Irradiance</span>
                  <span className="text-xs font-mono font-bold text-copper-500">920 W/m²</span>
                </div>
              </div>
            </div>

            {/* Card 2: Predictive Yield Analytics */}
            <div className="p-6 rounded-2xl bg-warmBg dark:bg-[#202020] border border-borderNeutral dark:border-[#262626] space-y-3 hover:border-forest-500/40 dark:hover:border-forest-500/40 transition-all duration-300 shadow-subtle group flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-forest-500/10 text-forest-500 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-primaryText dark:text-white">Predictive Yield Analytics</h3>
                <p className="text-xs text-secondaryText dark:text-gray-400 leading-relaxed">
                  Executive analytics suite identifying thermal hotspots, string mismatch losses, and seasonal efficiency degradation.
                </p>
              </div>
              <div className="pt-2">
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium inline-block">
                  Yield Accuracy: 99.4%
                </span>
              </div>
            </div>

            {/* Card 3: Automated Anomaly Center */}
            <div className="p-6 rounded-2xl bg-warmBg dark:bg-[#202020] border border-borderNeutral dark:border-[#262626] space-y-3 hover:border-forest-500/40 dark:hover:border-forest-500/40 transition-all duration-300 shadow-subtle group flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-copper-500/10 text-copper-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-primaryText dark:text-white">Automated Anomaly Center</h3>
                <p className="text-xs text-secondaryText dark:text-gray-400 leading-relaxed">
                  Instant alert logging for cell overheating (&gt;55°C), low conversion yield, low DC bus voltage, and gateway disconnects.
                </p>
              </div>
              <div className="pt-2 flex items-center gap-2 text-[10px] font-mono text-copper-600 dark:text-copper-400 bg-copper-500/10 px-2.5 py-1 rounded-lg border border-copper-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-copper-500 animate-pulse"></span>
                <span>Active Scanner Ingestion</span>
              </div>
            </div>

            {/* Card 4: Field Maintenance Dispatch */}
            <div className="p-6 rounded-2xl bg-warmBg dark:bg-[#202020] border border-borderNeutral dark:border-[#262626] space-y-3 hover:border-forest-500/40 dark:hover:border-forest-500/40 transition-all duration-300 shadow-subtle group flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-forest-500/10 text-forest-500 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-primaryText dark:text-white">Field Maintenance Dispatch</h3>
                <p className="text-xs text-secondaryText dark:text-gray-400 leading-relaxed">
                  Schedule field technicians, log bypass diode repairs, track component replacements, and manage resolution timelines.
                </p>
              </div>
              <div className="pt-2">
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-white dark:bg-[#181818] text-secondaryText dark:text-gray-300 border border-borderNeutral dark:border-[#2A2A2A] font-medium inline-block">
                  Work Order Sync
                </span>
              </div>
            </div>

            {/* Card 5: Photovoltaic Benchmarking */}
            <div className="p-6 rounded-2xl bg-warmBg dark:bg-[#202020] border border-borderNeutral dark:border-[#262626] space-y-3 hover:border-forest-500/40 dark:hover:border-forest-500/40 transition-all duration-300 shadow-subtle group flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-forest-500/10 text-forest-500 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Sliders className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-primaryText dark:text-white">Photovoltaic Benchmarking</h3>
                <p className="text-xs text-secondaryText dark:text-gray-400 leading-relaxed">
                  Benchmark panel performance tolerances against rated STC capacity across rooftop, ground, and carport arrays.
                </p>
              </div>
              <div className="pt-2">
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-white dark:bg-[#181818] text-forest-500 dark:text-emerald-400 border border-borderNeutral dark:border-[#2A2A2A] font-medium inline-block">
                  STC Ratio: 98.6%
                </span>
              </div>
            </div>

            {/* Card 6: Multi-Format Compliance Export (Spans 3 cols on lg) */}
            <div className="lg:col-span-3 p-6 rounded-2xl bg-warmBg dark:bg-[#202020] border border-borderNeutral dark:border-[#262626] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-forest-500/40 dark:hover:border-forest-500/40 transition-all duration-300 shadow-subtle">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-forest-500 dark:text-emerald-400" />
                  <h3 className="text-sm font-bold text-primaryText dark:text-white">Multi-Format Compliance Export</h3>
                </div>
                <p className="text-xs text-secondaryText dark:text-gray-400 leading-relaxed">
                  Generate compliance audit reports for daily, weekly, monthly, and annual operational reviews in PDF and CSV format.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-mono px-3 py-1.5 rounded-lg bg-white dark:bg-[#181818] text-primaryText dark:text-white border border-borderNeutral dark:border-[#2A2A2A] font-semibold">
                  PDF Export
                </span>
                <span className="text-[10px] font-mono px-3 py-1.5 rounded-lg bg-white dark:bg-[#181818] text-primaryText dark:text-white border border-borderNeutral dark:border-[#2A2A2A] font-semibold">
                  CSV Export
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 5. PRODUCT PREVIEW SECTION ================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#141816] text-white border-b border-forest-500/20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-10 relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold text-[11px] uppercase tracking-wider">
              <Gauge className="w-3.5 h-3.5 text-emerald-400" />
              <span>Console Preview</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
              Everything Your Solar Fleet Tells You — In One Place
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              A central operational console engineered for real-time diagnostic control.
            </p>
          </div>

          {/* Controlled Realistic Solarix Dashboard Interface Preview */}
          <div className="bg-[#1C221F] border border-white/10 rounded-3xl p-5 sm:p-7 shadow-2xl glow-forest max-w-5xl mx-auto space-y-6">
            {/* Header bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                <span className="text-xs font-mono font-bold text-gray-300 ml-2">Solarix Fleet Overview</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>98.4% Fleet Healthy</span>
              </div>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-gray-400 block">Active Fleet</span>
                <span className="text-sm sm:text-base font-bold text-white block mt-0.5">4,850 Panels</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-gray-400 block">Fleet Efficiency</span>
                <span className="text-sm sm:text-base font-bold text-emerald-400 block mt-0.5">21.8% Avg</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-gray-400 block">Current Output</span>
                <span className="text-sm sm:text-base font-bold text-white block mt-0.5">428 kW</span>
              </div>
            </div>

            {/* Alert Indicator Preview Card inside UI */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold text-amber-300 block">Recent Telemetry Alert Logged</span>
                <span className="text-[11px] text-gray-300 block">Cell overheating detected on Panel String PV-2048 (58.4°C vs 55°C STC threshold).</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 6. INSIGHTS SECTION (#insights) ================= */}
      <section id="insights" className="py-20 px-4 sm:px-6 lg:px-8 bg-warmBg dark:bg-[#121212] border-b border-borderNeutral dark:border-[#262626] scroll-mt-20">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-500/10 border border-forest-500/20 text-forest-500 dark:text-emerald-400 font-semibold text-[11px] uppercase tracking-wider">
              <TrendingUp className="w-3 h-3 text-copper-500" />
              <span>Solar Performance Insights</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primaryText dark:text-white">
              Continuous Telemetry Intelligence
            </h2>
            <p className="text-xs sm:text-sm text-secondaryText dark:text-gray-400">
              Solarix converts raw telemetry into actionable performance insights.
            </p>
          </div>

          {/* 4 Minimal Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {insightsMetrics.map((item, idx) => {
              const MetricIcon = item.icon;
              return (
                <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-[#181818] border border-borderNeutral dark:border-[#262626] shadow-subtle space-y-1 transition-all hover:-translate-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-secondaryText dark:text-gray-400">{item.label}</span>
                    <MetricIcon className="w-3.5 h-3.5 text-forest-500 dark:text-emerald-400" />
                  </div>
                  <div className={`text-xl sm:text-2xl font-bold tracking-tight ${item.color}`}>
                    {item.value}
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-gray-500 block">{item.subtext}</span>
                </div>
              );
            })}
          </div>

          {/* Compact Mini Progress Indicator */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#181818] border border-borderNeutral dark:border-[#262626] shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-8 h-8 rounded-xl bg-forest-500/10 text-forest-500 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Gauge className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-primaryText dark:text-white block">Fleet Target Performance</span>
                <span className="text-[11px] text-secondaryText dark:text-gray-400">STC Performance Ratio</span>
              </div>
            </div>

            <div className="w-full sm:w-64 space-y-1">
              <div className="flex items-center justify-between text-[10px] font-semibold text-secondaryText dark:text-gray-400">
                <span>Yield Efficiency</span>
                <span className="text-forest-500 dark:text-emerald-400 font-mono">94.2%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-warmBg dark:bg-[#2A2A2A] overflow-hidden">
                <div className="h-full bg-forest-500 dark:bg-emerald-500 rounded-full w-[94.2%] transition-all duration-500"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 7. ALERT / ANOMALY VISUAL SECTION ================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#181818] border-b border-borderNeutral dark:border-[#262626]">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-copper-500 font-bold">Automated Diagnostics</span>
            <h3 className="text-lg sm:text-xl font-bold text-primaryText dark:text-white">Active Anomaly Detection</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Performance Alert Card */}
            <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                <span className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  PERFORMANCE ALERT
                </span>
                <span className="text-[10px] font-mono bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded">High Priority</span>
              </div>
              <div className="space-y-1 text-xs">
                <span className="font-bold text-primaryText dark:text-white block">Panel String PV-2048</span>
                <span className="text-secondaryText dark:text-gray-400 block">Temperature cell above STC threshold</span>
                <div className="flex items-center gap-3 pt-1 text-[11px] font-mono">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">58.4°C</span>
                  <span className="text-secondaryText dark:text-gray-400">(Threshold: 55°C)</span>
                </div>
              </div>
              <div className="pt-1 text-[10px] text-amber-700 dark:text-amber-300 font-medium">
                ● Field Inspection Required
              </div>
            </div>

            {/* Fleet Status Nominal Card */}
            <div className="p-5 rounded-2xl bg-forest-500/5 dark:bg-emerald-500/5 border border-forest-500/20 dark:border-emerald-500/20 space-y-3">
              <div className="flex items-center justify-between border-b border-forest-500/20 pb-2">
                <span className="text-[11px] font-mono font-bold text-forest-500 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  FLEET STATUS NOMINAL
                </span>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded">Grid Sync</span>
              </div>
              <div className="space-y-1 text-xs">
                <span className="font-bold text-primaryText dark:text-white block">4,827 Panels Operating Normally</span>
                <span className="text-secondaryText dark:text-gray-400 block">Substation grid synchronization active</span>
                <div className="flex items-center gap-3 pt-1 text-[11px] font-mono">
                  <span className="text-forest-500 dark:text-emerald-400 font-bold">100% Ingestion</span>
                  <span className="text-secondaryText dark:text-gray-400">(Zero Loss)</span>
                </div>
              </div>
              <div className="pt-1 text-[10px] text-forest-600 dark:text-emerald-400 font-medium">
                ● Telemetry Stream Active
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 8. ABOUT SECTION (#about) ================= */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-warmBg dark:bg-[#121212] border-b border-borderNeutral dark:border-[#262626] scroll-mt-20">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Split Layout: Left Content & Right Architecture Flow */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left Column */}
            <div className="space-y-6 text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-500/10 border border-forest-500/20 text-forest-500 dark:text-emerald-400 font-semibold text-[11px] uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-forest-500" />
                <span>About Solarix</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-primaryText dark:text-white">
                Built to Make Solar Operations Smarter
              </h2>
              <p className="text-xs sm:text-sm text-secondaryText dark:text-gray-400 leading-relaxed">
                Solarix is a solar fleet monitoring and telemetry analytics platform designed to help operators monitor photovoltaic systems, identify performance anomalies, understand energy generation, and streamline maintenance through a centralized platform.
              </p>

              {/* 3 Compact Value Cards */}
              <div className="space-y-3 pt-2">
                {valueCards.map((card, idx) => {
                  const CardIcon = card.icon;
                  return (
                    <div key={idx} className="p-4 rounded-xl bg-white dark:bg-[#181818] border border-borderNeutral dark:border-[#262626] flex items-start gap-3 shadow-subtle">
                      <div className="w-7 h-7 rounded-lg bg-forest-500/10 text-forest-500 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <CardIcon className="w-3.5 h-3.5" />
                      </div>
                      <div className="space-y-0.5">
                        <h3 className="text-xs font-bold text-primaryText dark:text-white">{card.title}</h3>
                        <p className="text-[11px] text-secondaryText dark:text-gray-400">{card.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Platform Architecture Flow Diagram */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#161B18] text-white border border-forest-500/30 space-y-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">SOLARIX PLATFORM ARCHITECTURE</span>
                <span className="text-[10px] font-mono text-gray-400">System Flow</span>
              </div>

              <div className="space-y-3 text-xs font-mono">
                {[
                  { stage: 'Sensors', detail: 'Panel Arrays & Thermal Nodes' },
                  { stage: 'Telemetry Ingestion', detail: 'Edge Gateways' },
                  { stage: 'Analytics Engine', detail: 'Yield & STC Benchmark' },
                  { stage: 'Anomaly Intelligence', detail: 'Hotspot Scanner' },
                  { stage: 'Operations', detail: 'Field Work Orders' }
                ].map((node, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                      <span className="font-bold text-white">{node.stage}</span>
                    </div>
                    <span className="text-[10px] text-gray-400">{node.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Technology Badges Row */}
          <div className="text-center pt-6 border-t border-borderNeutral/60 dark:border-[#262626]">
            <span className="text-[11px] font-semibold text-secondaryText dark:text-gray-400 mr-3">Powered by</span>
            <div className="inline-flex flex-wrap justify-center gap-2 mt-2 sm:mt-0">
              {techBadges.map((tech, idx) => (
                <span key={idx} className="text-xs font-medium px-2.5 py-1 rounded-lg bg-white dark:bg-[#181818] border border-borderNeutral dark:border-[#2A2A2A] text-primaryText dark:text-white">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= 9. ENVIRONMENTAL IMPACT STRIP ================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#161B18] text-white border-b border-forest-500/20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-8 text-center relative z-10">
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400">Environmental Impact</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Turning Solar Data Into Real-World Impact</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-3xl font-extrabold text-emerald-400 block">1.42 GWh</span>
              <span className="text-xs text-gray-300 font-medium block">Clean Energy Generated</span>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-3xl font-extrabold text-amber-400 block">994 Tons</span>
              <span className="text-xs text-gray-300 font-medium block">CO₂ Emissions Offset</span>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-3xl font-extrabold text-white block">4,850+</span>
              <span className="text-xs text-gray-300 font-medium block">Panels Monitored</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 10. FINAL CTA SECTION ================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-warmBg dark:bg-[#121212]">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-[#1A382E] via-[#121614] to-[#121212] text-white p-10 sm:p-14 text-center space-y-6 shadow-2xl glow-forest border border-forest-500/30 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              See Your Solar Fleet Differently
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 font-mono tracking-widest uppercase">
              Monitor · Analyze · Detect · Optimize
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-forest-500 hover:bg-forest-600 text-white font-bold text-xs shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              Access Live Console
            </Link>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-white/20 text-white hover:bg-white/10 font-semibold text-xs transition-all transform hover:-translate-y-0.5"
            >
              Explore Solarix
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
