import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import Toast from '../components/Toast';
import { fetchPanelsApi, fetchDashboardStatsApi } from '../services/api';
import {
  LineChart,
  Calendar,
  Zap,
  TrendingUp,
  Award,
  AlertTriangle,
  Sun,
  Flame,
  Activity,
  ChevronRight
} from 'lucide-react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AnalyticsPage = () => {
  const [timeframe, setTimeframe] = useState('Monthly'); // Daily, Weekly, Monthly, Yearly
  const [panels, setPanels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      try {
        const res = await fetchPanelsApi();
        if (res.data.success) {
          setPanels(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  // Compute Best & Lowest Performing Panels
  const sortedByEff = [...panels].sort((a, b) => b.efficiency - a.efficiency);
  const bestPanel = sortedByEff[0] || { panelId: 'SP-104', efficiency: 23.5, currentOutputKW: 4.41, location: 'Ground Array West Field 1' };
  const lowestPanel = sortedByEff[sortedByEff.length - 1] || { panelId: 'SP-103', efficiency: 14.2, currentOutputKW: 2.15, location: 'Carport East Canopy' };

  // Data mapping based on timeframe
  const timeframeData = {
    Daily: {
      labels: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
      production: [3.2, 12.8, 28.4, 42.1, 39.2, 26.5, 9.8],
      voltage: [46.2, 47.8, 48.5, 49.1, 48.9, 47.5, 46.0],
      temp: [22.1, 28.5, 36.2, 44.0, 43.5, 38.2, 31.0],
      efficiency: [21.8, 22.4, 22.8, 23.1, 22.9, 22.2, 21.5],
      totalYield: '202.0 kWh'
    },
    Weekly: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      production: [195, 210, 225, 205, 240, 235, 250],
      voltage: [48.1, 48.3, 48.6, 47.9, 48.8, 48.7, 49.0],
      temp: [38.2, 39.5, 41.0, 37.8, 42.1, 40.5, 39.0],
      efficiency: [22.1, 22.5, 22.8, 21.9, 23.0, 22.7, 23.2],
      totalYield: '1,560.0 kWh'
    },
    Monthly: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      production: [1850, 1980, 2100, 2040],
      voltage: [48.2, 48.4, 48.7, 48.5],
      temp: [37.5, 39.0, 41.2, 38.8],
      efficiency: [22.0, 22.4, 22.9, 22.6],
      totalYield: '7,970.0 kWh'
    },
    Yearly: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      production: [6200, 6800, 7900, 8400, 9200, 9800, 9600, 9400, 8300, 7500, 6400, 5900],
      voltage: [48.0, 48.2, 48.5, 48.8, 49.0, 49.2, 48.9, 48.7, 48.4, 48.2, 48.0, 47.9],
      temp: [28.0, 31.0, 35.0, 39.0, 43.0, 46.0, 45.0, 44.0, 39.0, 34.0, 30.0, 27.0],
      efficiency: [21.5, 21.8, 22.2, 22.6, 22.9, 23.2, 23.0, 22.8, 22.4, 22.0, 21.6, 21.4],
      totalYield: '94.7 MWh'
    }
  };

  const currentTf = timeframeData[timeframe];

  // Chart 1: Production Trend
  const productionChartData = {
    labels: currentTf.labels,
    datasets: [
      {
        label: `Energy Production (${timeframe})`,
        data: currentTf.production,
        borderColor: '#2E8B57',
        backgroundColor: 'rgba(46, 139, 87, 0.15)',
        fill: true,
        tension: 0.3,
        borderWidth: 3
      }
    ]
  };

  // Chart 2: Multi-Trend Comparison (Voltage, Temp, Efficiency)
  const multiTrendData = {
    labels: currentTf.labels,
    datasets: [
      {
        label: 'Efficiency (%)',
        data: currentTf.efficiency,
        borderColor: '#38BDF8',
        yAxisID: 'y1',
        borderWidth: 3,
        tension: 0.3
      },
      {
        label: 'Temperature (°C)',
        data: currentTf.temp,
        borderColor: '#F43F5E',
        borderDash: [4, 4],
        yAxisID: 'y2',
        borderWidth: 2,
        tension: 0.3
      },
      {
        label: 'Voltage (V)',
        data: currentTf.voltage,
        borderColor: '#F59E0B',
        yAxisID: 'y2',
        borderWidth: 2,
        tension: 0.3
      }
    ]
  };

  const multiTrendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#94a3b8' } }
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
      y1: {
        type: 'linear',
        position: 'left',
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#38BDF8' }
      },
      y2: {
        type: 'linear',
        position: 'right',
        grid: { drawOnChartArea: false },
        ticks: { color: '#F43F5E' }
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-lightBg dark:bg-navy-950 transition-colors">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10">
          <div>
            <span className="text-xs font-bold text-skyAccent-400 uppercase tracking-wider">Performance Intelligence</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 dark:text-white tracking-tight">
              Photovoltaic Analytics & Yield Trends
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Multi-timeframe degradation tracking, thermal correlation, and outlier benchmarking
            </p>
          </div>

          {/* Timeframe selector tabs */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl glass-panel border border-slate-200 dark:border-white/10">
            {['Daily', 'Weekly', 'Monthly', 'Yearly'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  timeframe === tf
                    ? 'bg-gradient-to-r from-solar-500 to-skyAccent-500 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Highlights: Best vs Lowest Performing Panel Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Best Performing Panel */}
          <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 relative overflow-hidden flex flex-col justify-between space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    ★ Best Performing Panel
                  </span>
                  <h3 className="text-xl font-extrabold text-navy-900 dark:text-white">
                    {bestPanel.panelId}
                  </h3>
                </div>
              </div>
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-500 text-white">
                {bestPanel.efficiency}% Efficiency
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/40 dark:bg-navy-900/40 border border-emerald-500/20">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Peak Power Output</span>
                <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">{bestPanel.currentOutputKW} kW</span>
              </div>
              <div className="p-3 rounded-xl bg-white/40 dark:bg-navy-900/40 border border-emerald-500/20">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Location Field</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">{bestPanel.location}</span>
              </div>
            </div>
          </div>

          {/* Lowest Performing Panel */}
          <div className="glass-panel p-6 rounded-3xl border border-amber-500/30 bg-amber-500/5 relative overflow-hidden flex flex-col justify-between space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    ⚠️ Lowest Performing Panel
                  </span>
                  <h3 className="text-xl font-extrabold text-navy-900 dark:text-white">
                    {lowestPanel.panelId}
                  </h3>
                </div>
              </div>
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-amber-500 text-white">
                {lowestPanel.efficiency}% Efficiency
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/40 dark:bg-navy-900/40 border border-amber-500/20">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Reduced Power Output</span>
                <span className="text-base font-bold text-amber-600 dark:text-amber-400">{lowestPanel.currentOutputKW} kW</span>
              </div>
              <div className="p-3 rounded-xl bg-white/40 dark:bg-navy-900/40 border border-amber-500/20">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Location Field</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">{lowestPanel.location}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Section: Selected Timeframe Analytics Summary */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-navy-900 dark:text-white">
                {timeframe} Photovoltaic Production Curve
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Aggregated yield output: <span className="font-bold text-solar-500">{currentTf.totalYield}</span>
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-solar-500/10 text-solar-500">
              {timeframe} Sampling
            </span>
          </div>

          <div className="h-72">
            <Line data={productionChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Section: Multi-Trend Graph (Voltage, Temp, Efficiency) */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-navy-900 dark:text-white">
                Cell Temperature vs Terminal Voltage vs Efficiency Correlation
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Cross-telemetry trend analysis showing inverse temperature degradation coefficient
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-skyAccent-400/10 text-skyAccent-400">
              Multi-Axis Graph
            </span>
          </div>

          <div className="h-80">
            <Line data={multiTrendData} options={multiTrendOptions} />
          </div>
        </div>

      </main>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
    </div>
  );
};

export default AnalyticsPage;
