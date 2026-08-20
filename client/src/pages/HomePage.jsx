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
  Gauge
} from 'lucide-react';

const HomePage = () => {
  // Fleet performance hero stats
  const stats = [
    { label: 'Active Fleet Panels', value: '4,850+', change: '+12% YOY', color: 'text-forest-500' },
    { label: 'Avg System Efficiency', value: '21.8%', change: '+3.4% target gain', color: 'text-copper-600' },
    { label: 'Clean Energy Generated', value: '1.42 GWh', change: 'Cumulative total', color: 'text-primaryText dark:text-white' },
    { label: 'Carbon Offset Savings', value: '994 Tons', change: 'CO₂ emissions offset', color: 'text-olive-600' },
  ];

  // How Solarix Works 5-step workflow
  const workflowSteps = [
    {
      num: '01',
      title: 'Collect',
      desc: 'Sensors capture power, voltage, current, temperature and irradiance.',
      icon: Database,
    },
    {
      num: '02',
      title: 'Process',
      desc: 'Solarix receives and organizes incoming telemetry.',
      icon: Cpu,
    },
    {
      num: '03',
      title: 'Analyze',
      desc: 'Performance and efficiency are continuously evaluated.',
      icon: BarChart3,
    },
    {
      num: '04',
      title: 'Detect',
      desc: 'The system identifies abnormal behavior and potential faults.',
      icon: AlertTriangle,
    },
    {
      num: '05',
      title: 'Act',
      desc: 'Operators receive alerts and can take maintenance action.',
      icon: Wrench,
    }
  ];

  // Existing capabilities
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

  // Insights minimal metric cards
  const insightsMetrics = [
    {
      value: '21.8%',
      label: 'Average Efficiency',
      subtext: '+3.4% vs STC baseline',
      icon: Activity,
      color: 'text-forest-500'
    },
    {
      value: '1.42 GWh',
      label: 'Energy Generated',
      subtext: 'Cumulative total output',
      icon: Zap,
      color: 'text-copper-600'
    },
    {
      value: '994 Tons',
      label: 'CO₂ Offset',
      subtext: 'Emissions offset',
      icon: Sun,
      color: 'text-olive-600'
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
      desc: 'Bring solar fleet data into one unified platform.',
      icon: Server,
    },
    {
      title: 'Data-Driven Decisions',
      desc: 'Convert telemetry into meaningful operational insights.',
      icon: BarChart3,
    },
    {
      title: 'Smarter Maintenance',
      desc: 'Identify problems early and improve maintenance response.',
      icon: Wrench,
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-warmBg dark:bg-[#121212] text-primaryText dark:text-neutral-100 transition-colors">

      {/* ================= 1. HOME SECTION (#home) ================= */}
      <section id="home" className="relative overflow-hidden px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center scroll-mt-20">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={solarVideo} type="video/mp4" />
        </video>

        {/* Video Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-warmBg dark:to-[#121212]" />

        <div className="relative z-10 max-w-7xl mx-auto space-y-10 animate-fade-in-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-500/15 border border-forest-500/30 text-white font-medium text-xs mx-auto backdrop-blur-md shadow-subtle">
            <Sun className="w-3.5 h-3.5 text-sand-400" />
            <span>Industrial Telemetry & Photovoltaic Intelligence</span>
          </div>

          {/* Heading & Subtitle */}
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Enterprise Solar Fleet Monitoring & Telemetry Analytics
            </h1>
            <p className="text-sm sm:text-base text-gray-200 max-w-2xl mx-auto leading-relaxed">
              Maximize photovoltaic generation efficiency, automate thermal anomaly detection, and streamline field work orders for utility-scale solar installations.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-forest-500 hover:bg-forest-600 text-white font-semibold text-xs shadow-subtle flex items-center justify-center gap-2 transition-all hover:shadow-md transform hover:-translate-y-0.5"
            >
              <span>Access Live Console</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 font-semibold text-xs transition-all transform hover:-translate-y-0.5"
            >
              Operator Sign In
            </Link>
          </div>

          {/* Fleet Statistics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto pt-6">
            {stats.map((item, idx) => (
              <div
                key={idx}
                className="saas-card p-4 text-left backdrop-blur-md bg-white/90 dark:bg-[#181818]/90 border-white/20 dark:border-[#2A2A2A]"
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

      {/* ================= 2. HOW IT WORKS SECTION (#how-it-works) ================= */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-warmBg dark:bg-[#121212] border-t border-borderNeutral dark:border-[#262626] scroll-mt-20">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-500/10 border border-forest-500/20 text-forest-500 dark:text-forest-400 font-semibold text-[11px] uppercase tracking-wider">
              <Radio className="w-3 h-3 text-copper-500" />
              <span>Workflow</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primaryText dark:text-white">
              How Solarix Works
            </h2>
            <p className="text-xs sm:text-sm text-secondaryText dark:text-gray-400 max-w-xl mx-auto">
              From raw panel telemetry to actionable operational decisions.
            </p>
          </div>

          {/* Desktop Workflow (Horizontal 5 Steps) */}
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
                      <span className="text-[11px] font-mono font-bold text-forest-500 dark:text-forest-400 bg-forest-500/10 px-2 py-0.5 rounded">
                        {item.num}
                      </span>
                      <div className="w-8 h-8 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#2A2A2A] text-forest-500 dark:text-forest-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <StepIcon className="w-4 h-4" />
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-primaryText dark:text-white">{item.title}</h3>
                    <p className="text-xs text-secondaryText dark:text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>

                  {/* Arrow Connector */}
                  {idx < workflowSteps.length - 1 && (
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white dark:bg-[#222] border border-borderNeutral dark:border-[#333] flex items-center justify-center text-forest-500 shadow-sm">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile Workflow (Vertical Stack) */}
          <div className="lg:hidden space-y-3">
            {workflowSteps.map((item, idx) => {
              const StepIcon = item.icon;
              return (
                <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-[#181818] border border-borderNeutral dark:border-[#262626] shadow-subtle flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-forest-500/10 text-forest-500 shrink-0 flex items-center justify-center font-bold text-xs">
                    {item.num}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs sm:text-sm font-bold text-primaryText dark:text-white flex items-center gap-2">
                      <span>{item.title}</span>
                      <StepIcon className="w-3.5 h-3.5 text-forest-500" />
                    </h3>
                    <p className="text-xs text-secondaryText dark:text-gray-400">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= 3. FEATURES SECTION (#features) ================= */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#181818] border-y border-borderNeutral dark:border-[#262626] scroll-mt-20">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-500/10 border border-forest-500/20 text-forest-500 dark:text-forest-400 font-semibold text-[11px] uppercase tracking-wider">
              <Activity className="w-3 h-3 text-forest-500" />
              <span>Capabilities</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primaryText dark:text-white">
              Built for Renewable Energy Enterprise Operations
            </h2>
            <p className="text-xs sm:text-sm text-secondaryText dark:text-gray-400">
              Industrial IoT infrastructure engineered for high-frequency telemetry processing and zero-downtime grid synchronization.
            </p>
          </div>

          {/* 6 Capabilities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {capabilities.map((cap, idx) => {
              const Icon = cap.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-warmBg dark:bg-[#202020] border border-borderNeutral dark:border-[#262626] space-y-3 hover:border-forest-500/40 dark:hover:border-forest-500/40 transition-all duration-300 shadow-subtle hover:-translate-y-1 group"
                >
                  <div className="w-9 h-9 rounded-xl bg-forest-500/10 text-forest-500 dark:text-forest-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-primaryText dark:text-white">{cap.title}</h3>
                  <p className="text-xs text-secondaryText dark:text-gray-400 leading-relaxed">{cap.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= 4. INSIGHTS SECTION (#insights) ================= */}
      <section id="insights" className="py-20 px-4 sm:px-6 lg:px-8 bg-warmBg dark:bg-[#121212] border-b border-borderNeutral dark:border-[#262626] scroll-mt-20">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-500/10 border border-forest-500/20 text-forest-500 dark:text-forest-400 font-semibold text-[11px] uppercase tracking-wider">
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {insightsMetrics.map((item, idx) => {
              const MetricIcon = item.icon;
              return (
                <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-[#181818] border border-borderNeutral dark:border-[#262626] shadow-subtle space-y-1 transition-all hover:-translate-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-secondaryText dark:text-gray-400">{item.label}</span>
                    <MetricIcon className="w-3.5 h-3.5 text-forest-500" />
                  </div>
                  <div className={`text-xl sm:text-2xl font-bold tracking-tight ${item.color}`}>
                    {item.value}
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-gray-500 block">{item.subtext}</span>
                </div>
              );
            })}
          </div>

          {/* Compact Mini Indicator / Sparkline Visual */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#181818] border border-borderNeutral dark:border-[#262626] shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-8 h-8 rounded-xl bg-forest-500/10 text-forest-500 flex items-center justify-center shrink-0">
                <Gauge className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-primaryText dark:text-white block">Fleet Operational Target</span>
                <span className="text-[11px] text-secondaryText dark:text-gray-400">STC Performance Ratio Sync</span>
              </div>
            </div>

            {/* Horizontal progress visual */}
            <div className="w-full sm:w-64 space-y-1">
              <div className="flex items-center justify-between text-[10px] font-semibold text-secondaryText dark:text-gray-400">
                <span>Fleet Yield Efficiency</span>
                <span className="text-forest-500 font-mono">94.2%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-warmBg dark:bg-[#2A2A2A] overflow-hidden">
                <div className="h-full bg-forest-500 rounded-full w-[94.2%] transition-all duration-500"></div>
              </div>
            </div>

            {/* Compact Mini Sparkline curve */}
            <div className="hidden md:flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real-Time Ingestion Active</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 5. ABOUT SECTION (#about) ================= */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#181818] border-b border-borderNeutral dark:border-[#262626] scroll-mt-20">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Main Header */}
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-500/10 border border-forest-500/20 text-forest-500 dark:text-forest-400 font-semibold text-[11px] uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-forest-500" />
              <span>About Solarix</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primaryText dark:text-white">
              Built to Make Solar Operations Smarter
            </h2>
            <p className="text-xs sm:text-sm text-secondaryText dark:text-gray-400 leading-relaxed">
              Solarix is a solar fleet monitoring and telemetry analytics platform designed to help operators monitor photovoltaic systems, identify performance anomalies, understand energy generation, and streamline maintenance through a centralized platform.
            </p>
          </div>

          {/* 3 Compact Value Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {valueCards.map((card, idx) => {
              const CardIcon = card.icon;
              return (
                <div key={idx} className="p-5 rounded-2xl bg-warmBg dark:bg-[#202020] border border-borderNeutral dark:border-[#262626] space-y-2 hover:-translate-y-1 transition-transform">
                  <div className="w-8 h-8 rounded-lg bg-forest-500/10 text-forest-500 flex items-center justify-center">
                    <CardIcon className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-primaryText dark:text-white">{card.title}</h3>
                  <p className="text-xs text-secondaryText dark:text-gray-400 leading-relaxed">{card.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Technology Stack Line */}
          <div className="text-center pt-4 border-t border-borderNeutral/60 dark:border-[#262626]">
            <span className="text-[11px] font-semibold text-secondaryText dark:text-gray-400 mr-2">Powered by</span>
            <span className="text-xs font-medium text-primaryText dark:text-white tracking-wide">
              React.js · Node.js · Express.js · MongoDB · Chart.js · JWT
            </span>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA SECTION ================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-warmBg dark:bg-[#121212]">
        <div className="max-w-5xl mx-auto rounded-3xl bg-forest-700 text-white p-8 sm:p-12 text-center space-y-6 shadow-xl relative overflow-hidden border border-forest-600">
          {/* Subtle background glow circle */}
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-forest-500/30 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Take Control of Your Solar Fleet
            </h2>
            <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
              Monitor performance, detect anomalies, and make smarter operational decisions with Solarix.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-forest-700 font-bold text-xs shadow-md hover:bg-slate-100 transition-all transform hover:-translate-y-0.5"
            >
              Access Live Console
            </Link>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-white/30 text-white hover:bg-white/10 font-semibold text-xs transition-all transform hover:-translate-y-0.5"
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
